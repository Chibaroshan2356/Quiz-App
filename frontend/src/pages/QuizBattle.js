import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { getSocket } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const QuizBattle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(-1);
  const [players, setPlayers] = useState({});
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [settings, setSettings] = useState({ quizTimeSeconds: 60, numQuestions: 10, maxPlayers: 2 });
  const [hostId, setHostId] = useState(null);
  const [myId, setMyId] = useState(null);
  const answersRef = useRef({});
  const initRef = useRef(false);
  const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || '');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (initRef.current) return; // avoid double-init in StrictMode
        initRef.current = true;
        const s = await getSocket();
        setSocket(s);
        s.on('connect', () => setMyId(s.id));
        const res = await quizAPI.getQuiz(id);
        setQuestions(res.data.questions || []);

        s.on('battle:lobby', ({ code: c, players: pls, host, settings: st, quizId }) => {
          if (c) setCode((prev) => prev || c);
          if (pls) setPlayers(pls);
          if (host) setHostId(host);
          if (st) setSettings(st);
        });
        s.on('battle:begin', ({ startAt, questions: qs, settings: st }) => {
          setQuestions(qs);
          if (st) setSettings(st);
          // Start immediately to avoid timing drift on some devices
          setIndex(0);
        });
        s.on('battle:state', ({ index: i, players: pls }) => {
          setIndex(i);
          setPlayers(pls);
          setSelected(null);
        });
        s.on('battle:finish', ({ leaderboard: lb }) => setLeaderboard(lb));

        // Auto-create if navigated from Multiplayer with autoCreate
        if (location.state?.autoCreate) {
          s.emit('battle:create', { quizId: id, name: localStorage.getItem('displayName') || 'Host', settings }, ({ code: c }) => {
            if (c) setCode(c);
          });
        }

        // Auto-join if link has ?code=XXXX (ensure we have a name first)
        const params = new URLSearchParams(location.search);
        const linkCode = params.get('code');
        if (linkCode) {
          setRoomCode(linkCode.toUpperCase());
          const name = localStorage.getItem('displayName');
          if (name && name.trim()) {
            s.emit('battle:join', { code: linkCode.toUpperCase(), name }, (res) => {
              if (res?.quizId) setCode(linkCode.toUpperCase());
            });
          }
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { socket?.disconnect?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const createRoom = async () => {
    if (!socket) return;
    socket.emit('battle:create', { quizId: id, name: localStorage.getItem('displayName') || 'Host', settings }, ({ code: c }) => setCode(c));
  };
  const joinRoom = async () => {
    if (!roomCode) return;
    const name = (displayName && displayName.trim()) ? displayName.trim() : (localStorage.getItem('displayName') || 'You');
    if (!localStorage.getItem('displayName') && name && name !== 'You') {
      localStorage.setItem('displayName', name);
    }
    socket.emit('battle:join', { code: roomCode, name }, (res) => {
      if (res?.quizId) setCode(roomCode);
    });
  };
  const startBattle = () => {
    if (!socket || myId !== hostId) return;
    socket.emit('battle:start', { code, questions });
  };
  const submit = (optIdx) => {
    const q = questions[index];
    setSelected(optIdx);
    answersRef.current[q.id] = optIdx;
    socket.emit('battle:answer', { code, questionId: q.id, selected: optIdx });
  };
  const next = () => {
    const correctMap = {}; // optional; if host can provide correctness
    socket.emit('battle:next', { code, correctAnswers: correctMap });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg"/></div>;
  if (leaderboard) {
    return (
      <div className="section">
        <h1 className="display text-3xl mb-6">Battle Results</h1>
        <div className="max-w-xl mx-auto">
          <div className="grid grid-cols-3 gap-4 items-end">
            {leaderboard.slice(0,3).map((p, i) => (
              <div key={i} className={`surface p-4 text-center elevated animate-bounce-in`} style={{height: i===0?180:i===1?140:120}}>
                <div className="text-2xl font-bold">{i===0?'1st':i===1?'2nd':'3rd'}</div>
                <div className="mt-2 font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">{p.score} pts</div>
              </div>
            ))}
          </div>
          <div className="surface p-4 mt-4">
            {leaderboard.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="font-medium">{i+1}. {p.name}</span>
                <span className="font-semibold">{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <button className="btn btn-gradient" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {!code ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface p-6">
            <h2 className="text-xl font-semibold mb-2">Create Room</h2>
            <button className="btn btn-gradient" onClick={createRoom}>Create</button>
            {code && (
              <div className="mt-2">
                <p>Room code: <span className="font-mono font-semibold">{code}</span></p>
                <button className="btn btn-glass mt-2" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}/battle?code=${code}`)}>Copy Share Link</button>
              </div>
            )}
          </div>
          <div className="surface p-6">
            <h2 className="text-xl font-semibold mb-2">Join Room</h2>
            <div className="mb-2">
              <label className="text-sm text-gray-600">Your name</label>
              <input className="input mt-1" placeholder="Enter name" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />
            </div>
            <input className="input mb-3" placeholder="Enter code" value={roomCode} onChange={(e)=>setRoomCode(e.target.value.toUpperCase())}/>
            <button className="btn btn-glass" onClick={joinRoom}>Join</button>
          </div>
        </div>
      ) : index < 0 ? (
        <div className="surface p-6">
          <p className="mb-3">Share code <span className="font-mono">{code}</span> with your friend or send the link below.</p>
          <div className="flex items-center gap-2 mb-4">
            <input className="input" readOnly value={`${window.location.origin}/quiz/${id}/battle?code=${code}`} />
            <button className="btn btn-glass" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}/battle?code=${code}`)}>Copy</button>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <input className="input w-48 font-mono" readOnly value={code} />
            <button className="btn btn-glass" onClick={() => navigator.clipboard.writeText(code)}>Copy code</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold mb-1">Settings</h3>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm text-gray-600 w-32">Quiz time (s)</label>
                <input type="number" className="input" value={settings.quizTimeSeconds}
                  onChange={(e)=>{
                    const val = Math.max(10, Number(e.target.value)||60);
                    setSettings((s)=>({...s, quizTimeSeconds: val}));
                    if (socket && myId === hostId) socket.emit('battle:settings', { code, settings: { quizTimeSeconds: val } });
                  }} disabled={!(socket && myId === hostId)} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 w-32"># Questions</label>
                <input type="number" className="input" value={settings.numQuestions}
                  onChange={(e)=>{
                    const val = Math.max(1, Number(e.target.value)||10);
                    setSettings((s)=>({...s, numQuestions: val}));
                    if (socket && myId === hostId) socket.emit('battle:settings', { code, settings: { numQuestions: val } });
                  }} disabled={!(socket && myId === hostId)} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm text-gray-600 w-32">Max players</label>
                <input type="number" className="input" value={settings.maxPlayers}
                  onChange={(e)=>{
                    const val = Math.max(2, Number(e.target.value)||2);
                    setSettings((s)=>({...s, maxPlayers: val}));
                    if (socket && myId === hostId) socket.emit('battle:settings', { code, settings: { maxPlayers: val } });
                  }} disabled={!(socket && myId === hostId)} />
              </div>
              {!(socket && myId === hostId) && (
                <p className="text-xs text-gray-500 mt-2">Only host can change settings</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-1">Players</h3>
              <div className="flex flex-wrap gap-3">
                {Object.values(players).map((p, i)=> (
                  <div key={i} className="surface px-3 py-1 rounded-full text-sm">{p.name}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div />
            <button className="btn btn-gradient" onClick={startBattle} disabled={!(socket && myId === hostId)}>Start</button>
          </div>
        </div>
      ) : (
        <div className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Question {index+1} / {questions.length}</div>
            <div className="text-sm font-medium">{Object.values(players).map(p=>`${p.name}: ${p.score}pts`).join('  |  ')}</div>
          </div>
          <h2 className="text-xl font-semibold mb-4">{questions[index]?.question}</h2>
          <div className="space-y-2">
            {questions[index]?.options?.map((opt, i) => (
              <button
                type="button"
                key={i}
                onClick={() => selected == null && submit(i)}
                disabled={selected != null}
                className={`option-button surface ${selected===i?'option-selected':''} ${selected!=null?'disabled:opacity-60 disabled:cursor-not-allowed':''}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-4 text-right">
            <button className="btn btn-glass" onClick={next}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizBattle;


