import { Router } from "express";
import ReceiptController from "../controllers/ReceiptController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/receipts/add:
 *   post:
 *     summary: Adiciona um novo cupom fiscal
 *     tags: [Receipts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *               - totalValue
 *               - tributes
 *               - purchaseDate
 *             properties:
 *               storeName:
 *                 type: string
 *                 description: Nome do estabelecimento onde a compra foi realizada
 *                 example: "Supermercado Exemplo"
 *               totalValue:
 *                 type: number
 *                 description: Valor total da compra
 *                 example: 150.75
 *               tributes:
 *                 type: number
 *                 description: Valor dos impostos
 *                 example: 12.30
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 description: Data da compra no formato YYYY-MM-DD
 *                 example: "2023-10-25"
 *               nfeKey:
 *                 type: string
 *                 description: Chave da nota fiscal eletrônica
 *                 example: "35231012345678901234567890123456789012345678"
 *     responses:
 *       201:
 *         description: Cupom adicionado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       400:
 *         description: Dados inválidos
 */
router.post("/add", ReceiptController.addReceipt);

/**
 * @openapi
 * /api/receipts/list:
 *   get:
 *     summary: Lista todos os cupons fiscais do usuário
 *     tags: [Receipts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cupons recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: Identificador único do cupom
 *                   storeName:
 *                     type: string
 *                     description: Nome do estabelecimento onde a compra foi realizada
 *                   totalValue:
 *                     type: number
 *                     description: Valor total da compra
 *                   tributes:
 *                     type: number
 *                     description: Valor dos impostos
 *                   purchaseDate:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora da compra
 *                   nfeKey:
 *                     type: string
 *                     description: Chave da nota fiscal eletrônica
 *       401:
 *         description: Usuário não autenticado
 */
router.get("/list", ReceiptController.listReceipts);

/**
 * @openapi
 * /api/receipts/search:
 *   get:
 *     summary: Busca um cupom fiscal no SEFAZ pelo URL do QR code
 *     tags: [Receipts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: url
 *         in: query
 *         description: URL do cupom fiscal
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cupom encontrado com sucesso
 *       400:
 *         description: Parâmetro de consulta inválido
 *       500:
 *         description: Erro interno ao buscar NFC-e
 */
router.get("/search", ReceiptController.searchNewReceipt);

/**
 * @openapi
 * /api/receipts/{nfeKey}:
 *   get:
 *     summary: Busca um cupom fiscal pela chave da NFC-e
 *     tags: [Receipts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nfeKey
 *         in: path
 *         description: Chave da nota fiscal eletrônica (44 caracteres)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cupom encontrado com sucesso
 *       404:
 *         description: Cupom não encontrado
 */
router.get("/:nfeKey", ReceiptController.getReceipt);

/**
 * @openapi
 * /api/receipts/{nfeKey}:
 *   delete:
 *     summary: Deleta um cupom fiscal pela chave da NFC-e
 *     tags: [Receipts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nfeKey
 *         in: path
 *         description: Chave da nota fiscal eletrônica (44 caracteres)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cupom deletado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cupom não encontrado
 */
router.delete("/:nfeKey", ReceiptController.deleteReceipt);

export default router;