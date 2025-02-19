import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { 
  getServices, 
  createService, 
  deleteService 
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Protected routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createService);
router.delete('/:id', deleteService);

export default router; 