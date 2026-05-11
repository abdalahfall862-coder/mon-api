import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService.js";

const userService = new UserService();

export class UserController {
    
    // Inscription : On enlève le bloc de test et on rétablit la vraie logique
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const newUser = await userService.register({username, email, password});
            
            // On ne renvoie pas le password dans la réponse
            const { password: _, ...userResponse } = newUser;
            
            res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    // Connexion
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

    // Liste des utilisateurs (Sécurisée)
    static async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findAll();
            
            // PROTECTION : On retire le champ password de chaque utilisateur
            const usersSafe = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.status(200).json(usersSafe);
        } catch (error: any) {
            next(error); 
        }
    }
}