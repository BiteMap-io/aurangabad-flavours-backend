import { Router } from 'express';
import multer from 'multer';
import restaurantController from '../../controllers/restaurant.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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
  authorize(['admin']),
  upload.single('image'),
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
  authorize(['admin']),
  upload.single('image'),
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

export default router;
