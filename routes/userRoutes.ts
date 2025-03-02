import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  const { email, password, role, username } = req.body;
  try {
    if (!email || !password || !role || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role, username });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  const { email, password, role, username } = req.body;
  try {
    if (!email || !password || !role || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, password: hashedPassword, role, username },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
