import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  linkUsers,
  unlinkUsers,
  getGraphData,
} from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/link', linkUsers);
router.delete('/users/:id/unlink', unlinkUsers);
router.get('/graph', getGraphData);

export default router;

