import { Router } from 'express';
import userRoutes from './user.routes';

import authRoutes from './auth.routes';
import articleRoutes from './article.routes';
import dishRoutes from './dish.routes';
import foodTrailRoutes from './foodTrail.routes';
import restaurantRoutes from './restaurant.routes';
import eventRoutes from './event.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/dishes', dishRoutes);
router.use('/food-trails', foodTrailRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/events', eventRoutes);

export default router;
