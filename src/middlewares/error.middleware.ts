import type { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // Si l'erreur a un code de statut spécifique, on l'utilise, sinon 500
    const status = err.status || 500;
    const message = err.message || "Une erreur interne est survenue sur le serveur";

    console.error(`[ERROR] ${req.method} ${req.url} : ${message}`);

    res.status(status).json({
        status,
        message,
        // On n'affiche la pile d'erreur (stack) qu'en développement pour la sécurité
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};