import type { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {    
    const status = err.status || 500;
    const message = err.message || "Une erreur interne est survenue sur le serveur";

    console.error(`[ERROR] ${req.method} ${req.url} : ${message}`);

    res.status(status).json({
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};