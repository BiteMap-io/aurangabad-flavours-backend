import { Router } from 'express';
import dishController from '../../controllers/dish.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Dish management
 */

/**
 * @swagger
 * /v1/dishes:
 *   get:
 *     summary: Get all dishes (Public)
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: List of dishes
 */
router.get('/', dishController.getAllDishes);

/**
 * @swagger
 * /v1/dishes/{id}:
 *   get:
 *     summary: Get dish by ID (Public)
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish details
 *       404:
 *         description: Dish not found
 */
router.get('/:id', dishController.getDishById);

/**
 * @swagger
 * /v1/dishes:
 *   post:
 *     summary: Create a new dish
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, category, restaurantId]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *               restaurantId:
 *                 type: string
 *                 description: Restaurant ID
 *     responses:
 *       201:
 *         description: Dish created
 */
router.post('/', authenticate, authorize(['admin']), dishController.createDish);

/**
 * @swagger
 * /v1/dishes/{id}:
 *   put:
 *     summary: Update a dish
 *     tags: [Dishes]
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
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dish updated
 */
router.put('/:id', authenticate, authorize(['admin']), dishController.updateDish);

/**
 * @swagger
 * /v1/dishes/{id}:
 *   delete:
 *     summary: Delete a dish
 *     tags: [Dishes]
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
 *         description: Dish deleted
 */
router.delete('/:id', authenticate, authorize(['admin']), dishController.deleteDish);

export default router;
