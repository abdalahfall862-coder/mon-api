import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 

import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { CreateUserDto } from "../dto/CreateUser.dto.js"; 

const router = Router();

// Inscription (Remplace /users par /register pour plus de clarté)
router.post(
    "/register", 
    validationMiddleware(CreateUserDto),
    UserController.register
);

// Connexion (Celle qui te manquait !)
router.post(
    "/login", 
    UserController.login
);

// Liste des utilisateurs
router.get("/users", authMiddleware, UserController.getAll);

export default router;