import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { CreateUserDto } from "../dto/CreateUser.dto.js"; 

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Inscription et Connexion
 *   - name: Users
 *     description: Gestion des utilisateurs (CRUD)
 */

// --- AUTHENTIFICATION ---

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
router.post("/register", validationMiddleware(CreateUserDto), UserController.register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Se connecter pour obtenir un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 */
router.post("/login", UserController.login);


// --- GESTION DES UTILISATEURS (CRUD) ---

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/users", authMiddleware, UserController.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
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
 *         description: Utilisateur trouvé avec succès
 *       401:
 *         description: Non autorisé (Token invalide)
 *       404:
 *         description: Utilisateur non trouvé
 */
// AJOUT ICI : La ligne qui manquait pour lier l'ID au contrôleur
router.get("/users/:id", authMiddleware, UserController.getOne);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 */
router.delete("/users/:id", authMiddleware, UserController.delete);

export default router;