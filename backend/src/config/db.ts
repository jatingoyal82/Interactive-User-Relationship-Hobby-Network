import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URL = process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/user-network';

export const connectDB = async (): Promise<void> => {
  try {
    const options = {
      // Remove deprecated options, use modern defaults
    };
    
    await mongoose.connect(DB_URL, options);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Connection string (first 20 chars):', DB_URL.substring(0, 20) + '...');
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};

