import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: /api/auth/register - Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *               name:
 *                 type: string
 *                 description: Nome do usuário (opcional)
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário registrado com sucesso"
 *       400:
 *         description: Erro na validação dos dados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "E-mail inválido ou senha muito curta"
 *       409:
 *         description: Conflito - Usuário já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Este e-mail já está em uso"
 *
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: /api/auth/login - Autentica um usuário e retorna um token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticação
 *       401:
 *         description: Credenciais inválidas (E-mail ou senha incorretos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Senha incorreta"
 */
router.post("/login", AuthController.login);

export default router;
