import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    // On récupère le token
    const token = authHeader.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Format de token invalide." });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("ERREUR : JWT_SECRET n'est pas défini dans le fichier .env");
        return res.status(500).json({ message: "Erreur de configuration serveur" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        
        (req as any).user = decoded; 
        next();
    } catch (error: any) {
        console.error("Détail de l'erreur JWT :", error.message);
        return res.status(401).json({ message: "Token invalide : " + error.message });
    }
};