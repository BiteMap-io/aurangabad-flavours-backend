import { Router } from 'express';
import dishController from '../../controllers/dish.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

// Retrieve all dishes - Authenticated users
router.get('/', authenticate, dishController.getAllDishes);

// Retrieve a single dish - Authenticated users
router.get('/:id', authenticate, dishController.getDishById);

// Create a new dish - Admin only
router.post('/', authenticate, authorize(['admin']), dishController.createDish);

// Update a dish - Admin only
router.put('/:id', authenticate, authorize(['admin']), dishController.updateDish);

// Delete a dish - Admin only
router.delete('/:id', authenticate, authorize(['admin']), dishController.deleteDish);

export default router;
