import { Router } from 'express';
import foodTrailController from '../../controllers/foodTrail.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: FoodTrails
 *   description: Food trail management
 */

/**
 * @swagger
 * /v1/food-trails:
 *   get:
 *     summary: Get all food trails
 *     tags: [FoodTrails]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of food trails
 */
router.get('/', foodTrailController.getAllFoodTrails);

/**
 * @swagger
 * /v1/food-trails/{id}:
 *   get:
 *     summary: Get food trail by ID
 *     tags: [FoodTrails]
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
 *         description: Food trail details
 *       404:
 *         description: Food trail not found
 */
router.get('/:id', foodTrailController.getFoodTrailById);

/**
 * @swagger
 * /v1/food-trails:
 *   post:
 *     summary: Create a new food trail
 *     tags: [FoodTrails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, icon, color, estimatedTime]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               estimatedTime:
 *                 type: string
 *               restaurantsId:
 *                 type: array
 *                 items:
 *                   type: string
 *               highlights:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Food trail created
 */
router.post('/', authenticate, authorize(['admin']), foodTrailController.createFoodTrail);

/**
 * @swagger
 * /v1/food-trails/{id}:
 *   put:
 *     summary: Update a food trail
 *     tags: [FoodTrails]
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
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               estimatedTime:
 *                 type: string
 *               restaurantsId:
 *                 type: array
 *                 items:
 *                   type: string
 *               highlights:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Food trail updated
 */
router.put('/:id', authenticate, authorize(['admin']), foodTrailController.updateFoodTrail);

/**
 * @swagger
 * /v1/food-trails/{id}:
 *   delete:
 *     summary: Delete a food trail
 *     tags: [FoodTrails]
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
 *         description: Food trail deleted
 */
router.delete('/:id', authenticate, authorize(['admin']), foodTrailController.deleteFoodTrail);

export default router;
