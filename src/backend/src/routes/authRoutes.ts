import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { register, login, getUserInfo } from '../controllers/authController';
import { auth } from '../middleware/auth';
import User from '../models/User';

const router = Router();

// Helper type for role checking
type Role = 'admin' | 'user';

const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        
        next();
    };
};

// Auth routes with proper typing
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getUserInfo);

// Protected routes with role checking
router.get('/admin', auth, checkRole(['admin']), (req: Request, res: Response): void => {
    res.json({ message: 'Admin route' });
});

router.get('/user', auth, checkRole(['user']), (req: Request, res: Response): void => {
    res.json({ message: 'User route' });
});

// Add this route to promote users to admin
router.patch(
  '/promote/:userId',
  auth,
  checkRole(['admin']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.role = 'admin';
      await user.save();

      res.json({
        message: 'User promoted to admin successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error promoting user' });
    }
  }
);

export default router;