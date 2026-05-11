import "reflect-metadata";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./config/data-source.js";
import userRoutes from "./routes/UserRoutes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express(); // 1. On crée l'application d'abord !
const PORT = process.env.PORT || 3000;

// 2. Configuration Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Dexchange API",
            version: "1.0.0",
            description: "Documentation de mon API de gestion d'utilisateurs et tâches",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    // Vérifie bien que ce chemin correspond à tes fichiers réels
    apis: ["./src/routes/*.ts", "./src/entities/*.ts"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 3. Middlewares globaux
app.use(express.json()); 
app.use(morgan("dev"));

// 4. Routes de la documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 5. Routes de l'API
app.use("/api", userRoutes);

// 6. Middleware d'erreur (toujours en dernier)
app.use(errorMiddleware); 

// 7. Démarrage
async function start() {
    try {
        await AppDataSource.initialize();
        console.log("📦 MongoDB est connecté !");

        if (!process.env.JWT_SECRET) {
            console.log("⚠️ ATTENTION : JWT_SECRET n'est pas chargé.");
        }

        app.listen(PORT, () => {
            console.log(`🚀 Serveur actif sur : http://localhost:${PORT}`);
            console.log(`📑 Documentation disponible sur : http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("❌ Échec du démarrage :", error);
    }
}

start();