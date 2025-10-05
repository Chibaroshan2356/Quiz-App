const crypto = require('crypto');

// In-memory battle rooms. For production, move to Redis.
const rooms = new Map();

function generateCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Create a room for a quiz
    socket.on('battle:create', ({ quizId, name, settings }, ack) => {
      const code = generateCode();
      rooms.set(code, {
        quizId,
        host: socket.id,
        players: {}, // socketId -> { name, score }
        started: false,
        currentIndex: 0,
        answers: {}, // socketId -> { [questionId]: selected }
        settings: {
          quizTimeSeconds: settings?.quizTimeSeconds ?? 60,
          numQuestions: settings?.numQuestions ?? 10,
          maxPlayers: settings?.maxPlayers ?? 2,
        }
      });
      socket.join(code);
      // Ensure only one host entry even if reconnect fires
      const room = rooms.get(code);
      room.players[socket.id] = { name: name || 'Host', score: 0 };
      io.to(code).emit('battle:lobby', { 
        code,
        players: room.players,
        host: room.host,
        settings: room.settings,
        quizId: room.quizId,
      });
      if (ack) ack({ code });
    });

    // Join an existing room
    socket.on('battle:join', ({ code, name }, ack) => {
      const room = rooms.get(code);
      if (!room) return ack && ack({ error: 'Room not found' });
      // Enforce max players limit (excluding duplicates)
      const currentCount = Object.keys(room.players).length;
      // If full, try to evict a placeholder "You" (non-host) to allow real named join
      if (currentCount >= (room.settings?.maxPlayers ?? 2)) {
        const placeholder = [...Object.entries(room.players)].find(([sid, p]) => p?.name === 'You' && sid !== room.host);
        if (placeholder) {
          delete room.players[placeholder[0]];
        } else {
          return ack && ack({ error: 'Room full' });
        }
      }
      // Prevent duplicates by name (edge case where same browser refreshes)
      for (const [sid, p] of Object.entries(room.players)) {
        if (p.name === name && sid !== socket.id) {
          delete room.players[sid];
          break;
        }
      }
      // De-dup if same socket id exists (rare), else add
      room.players[socket.id] = { name: name || 'Player', score: 0 };
      socket.join(code);
      io.to(code).emit('battle:lobby', { 
        code,
        players: room.players, 
        host: room.host,
        settings: room.settings,
        quizId: room.quizId,
      });
      if (ack) ack({ ok: true, quizId: room.quizId, host: room.host, settings: room.settings });
    });

    // Update lobby settings (host only)
    socket.on('battle:settings', ({ code, settings }, ack) => {
      const room = rooms.get(code);
      if (!room || room.host !== socket.id) return ack && ack({ error: 'Not authorized' });
      room.settings = {
        quizTimeSeconds: Number(settings?.quizTimeSeconds) || room.settings.quizTimeSeconds,
        numQuestions: Number(settings?.numQuestions) || room.settings.numQuestions,
        maxPlayers: Number(settings?.maxPlayers) || room.settings.maxPlayers,
      };
      io.to(code).emit('battle:lobby', { 
        code,
        players: room.players, 
        host: room.host,
        settings: room.settings,
        quizId: room.quizId,
      });
      if (ack) ack({ ok: true });
    });

    // Host starts the battle by broadcasting a synced start time and index 0
    socket.on('battle:start', ({ code, questions }, ack) => {
      const room = rooms.get(code);
      if (!room || room.host !== socket.id) return;
      room.started = true;
      room.currentIndex = 0;
      // Store server-side with correctAnswer so we can score
      room.questions = (questions || []).map((q) => ({
        id: q._id,
        options: q.options,
        question: q.question,
        points: q.points || 1,
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : undefined,
      }));
      const startAt = Date.now() + 1200; // 1.2s delay for sync
      // Do not leak correct answers to clients
      const clientQs = room.questions.map(({ id, options, question, points }) => ({ id, options, question, points }));
      io.to(code).emit('battle:begin', { startAt, questions: clientQs, settings: room.settings });
      if (ack) ack({ ok: true });
    });

    // Receive answer from a player
    socket.on('battle:answer', ({ code, questionId, selected }, ack) => {
      const room = rooms.get(code);
      if (!room) return;
      room.answers[socket.id] = room.answers[socket.id] || {};
      // Score only once per player per question
      const already = Object.prototype.hasOwnProperty.call(room.answers[socket.id], questionId);
      room.answers[socket.id][questionId] = selected;
      // If correct, add points immediately
      const qIdx = room.questions.findIndex((q) => String(q.id) === String(questionId));
      if (!already && qIdx >= 0) {
        const q = room.questions[qIdx];
        if (typeof q.correctAnswer === 'number' && Number(selected) === Number(q.correctAnswer)) {
          if (room.players[socket.id]) {
            room.players[socket.id].score = (room.players[socket.id].score || 0) + (q.points || 1);
          }
        }
      }
      io.to(code).emit('battle:state', { index: room.currentIndex, players: room.players, host: room.host });
      if (ack) ack({ ok: true });
    });

    // Advance to next question (host only) and broadcast scores if needed
    socket.on('battle:next', ({ code, correctAnswers }, ack) => {
      const room = rooms.get(code);
      if (!room || room.host !== socket.id) return;
      // Tally any remaining using server-known correct answers if provided
      const current = room.questions?.[room.currentIndex];
      if (current) {
        const correct = typeof current.correctAnswer === 'number'
          ? current.correctAnswer
          : (correctAnswers && current.id in correctAnswers ? correctAnswers[current.id] : undefined);
        if (typeof correct === 'number') {
          Object.entries(room.answers).forEach(([sid, perQ]) => {
            if (!room.players[sid]) return;
            const selected = perQ[current.id];
            // If not scored yet (because player answered before server-side scoring), add now
            if (Number(selected) === Number(correct)) {
              // ensure at most once per question
              // scores already added in battle:answer, but this covers late scoring
              room.players[sid].score = room.players[sid].score || 0;
            }
          });
        }
      }

      room.currentIndex += 1;
      io.to(code).emit('battle:state', { index: room.currentIndex, players: room.players, host: room.host });
      if (room.currentIndex >= (room.questions?.length || 0)) {
        // Finish battle
        const leaderboard = Object.values(room.players)
          .map((p) => ({ name: p.name, score: p.score }))
          .sort((a, b) => b.score - a.score);
        io.to(code).emit('battle:finish', { leaderboard });
        rooms.delete(code);
      }
      if (ack) ack({ ok: true });
    });

    socket.on('disconnect', () => {
      // Remove player from any room
      for (const [code, room] of rooms.entries()) {
        if (room.players[socket.id]) {
          delete room.players[socket.id];
          io.to(code).emit('battle:lobby', { 
            code,
            players: room.players, 
            host: room.host,
            settings: room.settings,
            quizId: room.quizId,
          });
          if (Object.keys(room.players).length === 0) rooms.delete(code);
          break;
        }
      }
    });
  });
};


