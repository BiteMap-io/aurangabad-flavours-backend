import { Router } from 'express';
import multer from 'multer';
import restaurantController from '../../controllers/restaurant.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fieldSize: 50 * 1024 * 1024 } // 50MB limit for text fields (base64)
});

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management
 */

/**
 * @swagger
 * /v1/restaurants:
 *   get:
 *     summary: Get all restaurants (Public)
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /v1/restaurants/mine:
 *   get:
 *     summary: Get every restaurant owned by the authenticated restaurant owner (any approval status)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the owner's restaurants
 */
router.get('/mine', authenticate, authorize(['restaurant_owner']), restaurantController.getMyRestaurants);

/**
 * @swagger
 * /v1/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID (Public)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', restaurantController.getRestaurantById);

/**
 * @swagger
 * /v1/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, address, category]
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Restaurant created
 */
router.post(
  '/',
  authenticate,
  authorize(['admin', 'restaurant_owner']),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'menu', maxCount: 1 },
    { name: 'gallery', maxCount: 12 },
  ]),
  restaurantController.createRestaurant
);

/**
 * @swagger
 * /v1/restaurants/{id}:
 *   put:
 *     summary: Update restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'restaurant_owner']),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'menu', maxCount: 1 },
    { name: 'gallery', maxCount: 12 },
  ]),
  restaurantController.updateRestaurant
);

/**
 * @swagger
 * /v1/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted
 */
router.delete('/:id', authenticate, authorize(['admin']), restaurantController.deleteRestaurant);

/**
 * @swagger
 * /v1/restaurants/{id}/toggle-featured:
 *   patch:
 *     summary: Toggle restaurant featured status (Admin)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch(
  '/:id/toggle-featured',
  authenticate,
  authorize(['admin']),
  restaurantController.toggleFeatured
);

/**
 * @swagger
 * /v1/restaurants/{id}/approve:
 *   patch:
 *     summary: Approve a pending owner-submitted restaurant (Admin)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant approved and now public
 */
router.patch('/:id/approve', authenticate, authorize(['admin']), restaurantController.approveRestaurant);

/**
 * @swagger
 * /v1/restaurants/{id}/reject:
 *   patch:
 *     summary: Reject a pending owner-submitted restaurant, with an optional reason (Admin)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant rejected
 */
router.patch('/:id/reject', authenticate, authorize(['admin']), restaurantController.rejectRestaurant);

// ── Reviews (public POST, public GET via getById) ──────────────────────────
router.post('/:id/reviews', authenticate, restaurantController.addReview);

export default router;
