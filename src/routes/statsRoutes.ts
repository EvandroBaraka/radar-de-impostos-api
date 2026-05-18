import { Router } from "express";
import StatsController from "../controllers/StatsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/stats/summary:
 *   get:
 *     summary: Retorna um resumo dos impostos pagos pelo usuário
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Data de início do período
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Data de término do período
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Resumo dos impostos recuperado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSpent:
 *                   type: number
 *                   description: Valor total gasto pelo usuário
 *                 totalTaxes:
 *                   type: number
 *                   description: Valor total de impostos pagos pelo usuário
 *                 averageTaxRate:
 *                   type: number
 *                   description: Taxa média de impostos pagos pelo usuário
 */
router.get("/summary", StatsController.summary);

export default router;
