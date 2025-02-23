import express from 'express';
import cors from 'cors'; // Import cors
import authRoutes from './routes/authRoutes'; // Adjust the path if needed
import { connectToDatabase } from './utils/db'; // Ensure this path is correct
import userRoutes from './routes/userRoutes'; // Import the user routes


const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectToDatabase();

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use user routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 50001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
