import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService.js";

const userService = new UserService();

export class UserController {
    
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const newUser = await userService.register({ username, email, password });
            
            const { password: _, ...userResponse } = newUser;
            
            return res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

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
            const id  = req.params.id as string;

            // Vérification du format de l'ID MongoDB (24 caractères)
            if (!id || id.length !== 24) {
                return res.status(400).json({ message: "Format d'ID invalide" });
            }

            const user = await userService.findOne(id);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const { password, ...userSafe } = user;
            return res.status(200).json(userSafe);
        } catch (error) {
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
        } catch (error) {
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
            // 204 No Content : La suppression a réussi, on ne renvoie rien
            return res.status(204).send(); 
        } catch (error) {
            next(error);
        }
    }
}