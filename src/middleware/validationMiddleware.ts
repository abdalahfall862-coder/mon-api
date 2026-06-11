import type { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validationMiddleware(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Convertit le JSON reçu en instance de la classe DTO
        const output = plainToInstance(dtoClass, req.body);
        
        // Valide l'instance
        const errors = await validate(output);

        if (errors.length > 0) {
            // Si des erreurs existent, on les renvoie proprement
            const message = errors.map((error: any) => Object.values(error.constraints)).join(', ');
            res.status(400).json({ message });
        } else {
            next();
        }
    };
}