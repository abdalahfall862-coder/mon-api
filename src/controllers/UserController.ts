import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
    
    // 1. Inscription
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Champs obligatoires manquants" });
            }

            const newUser = await userService.register({ name, email, password });
            
            const { password: _, ...userResponse } = newUser as any;  // ← as any
            
            return res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: userResponse
            });
        } catch (error: any) {
            if (error.message === "Champs obligatoires manquants" || error.message === "Email déjà utilisé") {
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
                return res.status(401).json({ error: "Email ou mot de passe incorrect." });

            }
            next(error);
        }
    }

    // 3. Liste de tous les utilisateurs
    static async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findAll();
            
            // ← CORRIGÉ : users est un tableau, on map dessus
            const usersSafe = users.map((user: any) => {
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

            if (!id) {
                return res.status(400).json({ message: "ID requis" });
            }

            const user = await userService.findOne(id);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const { password, ...userSafe } = user as any;  // ← as any
            return res.status(200).json(userSafe);
        } catch (error: any) {
            next(error);
        }
    }

    // 5. Mettre à jour un utilisateur
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            if (!id) {
                return res.status(400).json({ message: "ID requis" });
            }

            const updatedUser = await userService.update(id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }

            const { password, ...userSafe } = updatedUser as any;  // ← as any
            return res.status(200).json({
                message: "Utilisateur mis à jour",
                user: userSafe
            });
        } catch (error: any) {
            next(error);
        }
    }

    // 6. Supprimer un utilisateur
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;

            if (!id) {
                return res.status(400).json({ message: "ID requis" });
            }

            await userService.delete(id);
            return res.status(204).send(); 
        } catch (error: any) {
            if (error.message === "Utilisateur non trouvé") {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }
            next(error);
        }
    }
}