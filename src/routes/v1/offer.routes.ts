import { Router } from 'express';
import offerController from '../../controllers/offer.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Restaurant offer management
 */

/**
 * @swagger
 * /v1/offers:
 *   get:
 *     summary: Get all offers, optionally filtered by restaurant (Public)
 *     tags: [Offers]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of offers
 */
router.get('/', offerController.getAllOffers);

/**
 * @swagger
 * /v1/offers/{id}:
 *   get:
 *     summary: Get offer by ID (Public)
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer details
 *       404:
 *         description: Offer not found
 */
router.get('/:id', offerController.getOfferById);

/**
 * @swagger
 * /v1/offers:
 *   post:
 *     summary: Create an offer for a restaurant you own (Admin or owning Restaurant Owner)
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, title, startDate, endDate]
 *             properties:
 *               restaurantId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               tiers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     minSpend:
 *                       type: number
 *                     discountPercent:
 *                       type: number
 *               audience:
 *                 type: string
 *                 enum: [all, student]
 *     responses:
 *       201:
 *         description: Offer created
 *       403:
 *         description: You do not own this restaurant
 */
router.post('/', authenticate, authorize(['admin', 'restaurant_owner']), offerController.createOffer);

/**
 * @swagger
 * /v1/offers/{id}:
 *   put:
 *     summary: Update an offer (Admin or owning Restaurant Owner)
 *     tags: [Offers]
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
 *         description: Offer updated
 *       403:
 *         description: You do not own this restaurant
 */
router.put('/:id', authenticate, authorize(['admin', 'restaurant_owner']), offerController.updateOffer);

/**
 * @swagger
 * /v1/offers/{id}:
 *   delete:
 *     summary: Delete an offer (Admin or owning Restaurant Owner)
 *     tags: [Offers]
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
 *         description: Offer deleted
 *       403:
 *         description: You do not own this restaurant
 */
router.delete('/:id', authenticate, authorize(['admin', 'restaurant_owner']), offerController.deleteOffer);

export default router;
