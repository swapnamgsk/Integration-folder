import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'b43d155180c2cab2b41d21651e0b656e5e16fc89d05ab2cf55b6be919937f726c33d3de3e4cf2ef48ba9dc4c34e92430ae3ade0c665151d405c8eeb8c173a7fb'; 

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
