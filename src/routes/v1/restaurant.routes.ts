import { Router } from 'express';
import restaurantController from '../../controllers/restaurant.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

// Retrieve all restaurants - Authenticated users
router.get('/', authenticate, restaurantController.getAllRestaurants);

// Retrieve a single restaurant - Authenticated users
router.get('/:id', authenticate, restaurantController.getRestaurantById);

// Create a new restaurant - Admin only
router.post('/', authenticate, authorize(['admin']), restaurantController.createRestaurant);

// Update a restaurant - Admin only
router.put('/:id', authenticate, authorize(['admin']), restaurantController.updateRestaurant);

// Delete a restaurant - Admin only
router.delete('/:id', authenticate, authorize(['admin']), restaurantController.deleteRestaurant);

export default router;
