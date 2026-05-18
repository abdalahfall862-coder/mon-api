import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService.js";

const userService = new UserService();

export class UserController {
    
    // 1. Inscription
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const newUser = await userService.register({ username, email, password });
            
            const { password: _, ...userResponse } = newUser;
            
            return res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: userResponse
            });
        } catch (error: any) {
            if (error.message === "Champs obligatoires manquants") {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }

    // 2. Connexion
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === "Utilisateur non trouvé" || error.message === "Mot de passe incorrect") {
                return res.status(401).json({ message: "Identifiants invalides" });
            }
            next(error);
        }
    }

    // 3. Liste de tous les utilisateurs
    static async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findAll();
            
            const usersSafe = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            return res.status(200).json(usersSafe);
        } catch (error: any) {
            next(error); 
        }
    }

    // 4. Récupérer un utilisateur par ID
    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            if (!id || id.length !== 24) {
                return res.status(400).json({ message: "Format d'ID invalide" });
            }

            const user = await userService.findOne(id);
            // findOne renvoyant null si non trouvé, on déclenche proprement la 404 ici
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const { password, ...userSafe } = user;
            return res.status(200).json(userSafe);
        } catch (error: any) {
            if (error.message === "Format d'ID invalide") {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }

    // 5. Mettre à jour un utilisateur
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            if (!id || id.length !== 24) {
                return res.status(400).json({ message: "ID invalide" });
            }

            const updatedUser = await userService.update(id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }

            const { password, ...userSafe } = updatedUser;
            return res.status(200).json({
                message: "Utilisateur mis à jour",
                user: userSafe
            });
        } catch (error: any) {
            // Si la sous-méthode findOne(id) appelée par update lève une erreur de format d'ID
            if (error.message === "Format d'ID invalide") {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }

    // 6. Supprimer un utilisateur
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            if (!id || id.length !== 24) {
                return res.status(400).json({ message: "ID invalide" });
            }

            await userService.delete(id);
            return res.status(204).send(); 
        } catch (error: any) {
            // Intercepte le throw Error("Utilisateur non trouvé") du UserService.delete()
            if (error.message === "Utilisateur non trouvé") {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }
            next(error);
        }
    }
}