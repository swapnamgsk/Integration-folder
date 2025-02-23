import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
} as mongoose.ConnectOptions;

// Database connection function
export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI, options);
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection disconnected through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit with failure
  }
};

// Function to close database connection
export const closeDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

// Function to clear database (useful for testing)
export const clearDatabase = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// Export mongoose instance
export default mongoose;
