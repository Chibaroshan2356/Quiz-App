// Seed multiple realistic users for development/demo
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : './env.example' });

async function connect() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/quiz-app';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function seedUsers() {
  const users = [
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'Password123!', role: 'user', avatar: '' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'Password123!', role: 'user', avatar: '' },
    { name: 'Carol Lee', email: 'carol@example.com', password: 'Password123!', role: 'user', avatar: '' },
    { name: 'Dave Kim', email: 'dave@example.com', password: 'Password123!', role: 'user', avatar: '' },
    { name: 'Eve Martin', email: 'eve@example.com', password: 'Password123!', role: 'user', avatar: '' },
    { name: 'Admin Demo', email: 'admin@example.com', password: 'AdminPass123!', role: 'admin', avatar: '' },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) continue;
    const user = new User(u);
    await user.save();
    // eslint-disable-next-line no-console
    console.log(`Created user: ${u.email} (${u.role})`);
  }
}

(async () => {
  try {
    await connect();
    await seedUsers();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seed error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();


