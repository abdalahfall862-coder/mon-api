import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService.js";

const userService = new UserService();

export class UserController {
    
    // 1. Inscription
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const newUser = await userService.register({username, email, password});
            
            const { password: _, ...userResponse } = newUser;
            
            res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    // 2. Connexion
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            
            res.status(200).json(result);
        } catch (error: any) {
            if (error.message === "Utilisateur non trouvé" || error.message === "Mot de passe incorrect") {
                return res.status(401).json({ message: error.message });
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

            res.status(200).json(usersSafe);
        } catch (error: any) {
            next(error); 
        }
    }

    // 4. Récupérer un utilisateur par ID (Nouveau)
    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.findOne(req.params.id as string);
            const { password, ...userSafe } = user;
            res.status(200).json(userSafe);
        } catch (error) {
            next(error);
        }
    }

    // 5. Mettre à jour un utilisateur (Nouveau)
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedUser = await userService.update(req.params.id as string, req.body);
            const { password, ...userSafe } = updatedUser;
            res.status(200).json({
                message: "Utilisateur mis à jour",
                user: userSafe
            });
        } catch (error) {
            next(error);
        }
    }

    // 6. Supprimer un utilisateur (Nouveau)
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.delete(req.params.id as string);
            res.status(204).send(); // 204 = Succès sans contenu à renvoyer
        } catch (error) {
            next(error);
        }
    }
}