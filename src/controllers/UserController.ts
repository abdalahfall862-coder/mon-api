import type { Request, Response } from "express"; 
import { UserService } from "../services/UserService.js";

const userService = new UserService();

export const UserController = {
    async create(req: Request, res: Response) {
        try {
            // req.body contient les données envoyées par l'utilisateur
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: "Erreur de création", error });
        }
    },

    async getAll(_req: Request, res: Response) {
        try {
            const users = await userService.findAll();
            const safeUsers = users.map(({ password, ...user }) => user);
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};
