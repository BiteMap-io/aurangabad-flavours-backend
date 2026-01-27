import { Router } from 'express';
import eventController from '../../controllers/event.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

// Retrieve all events - Authenticated users
router.get('/', authenticate, eventController.getAllEvents);

// Retrieve a single event - Authenticated users
router.get('/:id', authenticate, eventController.getEventById);

// Create a new event - Admin only
router.post('/', authenticate, authorize(['admin']), eventController.createEvent);

// Update an event - Admin only
router.put('/:id', authenticate, authorize(['admin']), eventController.updateEvent);

// Delete an event - Admin only
router.delete('/:id', authenticate, authorize(['admin']), eventController.deleteEvent);

export default router;
