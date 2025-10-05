import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { getSocket } from '../services/api';

const Multiplayer = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await quizAPI.getQuizzes({ limit: 50 });
        setQuizzes(res.data.quizzes || []);
      } catch {}
      setSocket(await getSocket());
    })();
    return () => socket?.disconnect?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goCreate = () => {
    if (!selectedQuiz) return;
    // Navigate to lobby and let that page create the room (prevents socket disconnect deleting the room)
    navigate(`/quiz/${selectedQuiz}/battle`, { state: { autoCreate: true } });
  };

  const goJoin = () => {
    if (!joinCode || !socket) return;
    setJoining(true);
    // Accept either a raw CODE or a full URL containing ?code=CODE
    let raw = (joinCode || '').trim();
    let code = raw.toUpperCase();
    try {
      const u = new URL(raw);
      const fromParam = u.searchParams.get('code');
      if (fromParam) code = fromParam.toUpperCase();
    } catch {}
    const name = localStorage.getItem('displayName') || 'You';
    socket.emit('battle:join', { code, name }, (res) => {
      setJoining(false);
      if (res?.quizId) {
        navigate(`/quiz/${res.quizId}/battle?code=${code}`);
      } else {
        alert(res?.error || 'Room not found');
      }
    });
  };

  return (
    <div className="section">
      <h1 className="display text-3xl mb-6">Multiplayer</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-3">Create a Room</h2>
          <p className="text-gray-600 mb-3">Choose a quiz to battle with a friend.</p>
          <select className="input mb-4" value={selectedQuiz} onChange={(e)=>setSelectedQuiz(e.target.value)}>
            <option value="">Select a quiz…</option>
            {quizzes.map((q)=> (
              <option key={q._id} value={q._id}>{q.title}</option>
            ))}
          </select>
          <button className="btn btn-gradient" disabled={!selectedQuiz} onClick={goCreate}>Start Lobby</button>
          <p className="text-sm text-gray-600 mt-3">A room code and shareable link will be generated.</p>
        </div>

        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-3">Join a Room</h2>
          <p className="text-gray-600 mb-3">Enter the code shared by your friend.</p>
          <input className="input mb-4" placeholder="ROOM CODE" value={joinCode} onChange={(e)=>setJoinCode(e.target.value.toUpperCase())} />
          <button className="btn btn-glass" onClick={goJoin} disabled={!joinCode || joining}>{joining ? 'Joining…' : 'Join'}</button>
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;


