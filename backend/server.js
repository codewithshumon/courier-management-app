import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/database.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

console.log('🔄 Connecting to MongoDB...');
connectDB();

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  
  const db = mongoose.connection;
  if (db.readyState === 1) {
    console.log(`🗄️  Database: ${db.name}`);
  } else {
    console.log('🗄️  Database: Connecting...');
  }
});

export { server };