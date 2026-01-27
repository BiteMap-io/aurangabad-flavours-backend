import { Router } from 'express';
import foodTrailController from '../../controllers/foodTrail.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

// Retrieve all food trails - Authenticated users
router.get('/', authenticate, foodTrailController.getAllFoodTrails);

// Retrieve a single food trail - Authenticated users
router.get('/:id', authenticate, foodTrailController.getFoodTrailById);

// Create a new food trail - Admin only
router.post('/', authenticate, authorize(['admin']), foodTrailController.createFoodTrail);

// Update a food trail - Admin only
router.put('/:id', authenticate, authorize(['admin']), foodTrailController.updateFoodTrail);

// Delete a food trail - Admin only
router.delete('/:id', authenticate, authorize(['admin']), foodTrailController.deleteFoodTrail);

export default router;
