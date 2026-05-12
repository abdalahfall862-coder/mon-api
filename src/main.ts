import "reflect-metadata";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors"; // Importé en haut
import { AppDataSource } from "./config/data-source.js";
import userRoutes from "./routes/UserRoutes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. MIDDLEWARES GLOBAUX (L'ordre est important !) ---
app.use(cors()); 
app.use(express.json()); 
app.use(morgan("dev"));

// --- 2. CONFIGURATION SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mohamed API",
            version: "1.0.0",
            description: "Documentation de mon API de gestion d'utilisateurs",
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
            schemas: {
                CreateUserDto: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: { type: "string", example: "Mohamed" },
                        email: { type: "string", example: "test@gmail.com" },
                        password: { type: "string", example: "Password123!" },
                    },
                },
                LoginDto: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "test@gmail.com" },
                        password: { type: "string", example: "Password123!" },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.{ts,js}", "./src/entities/*.{ts,js}", "./src/dtos/*.{ts,js}"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// --- 3. ROUTES ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", userRoutes);

// --- 4. MIDDLEWARE D'ERREUR (Toujours en dernier) ---
app.use(errorMiddleware); 

// --- 5. DÉMARRAGE DU SERVEUR ---
async function start() {
    try {
        await AppDataSource.initialize();
        console.log("📦 MongoDB est connecté !");

        if (!process.env.JWT_SECRET) {
            console.error("❌ ERREUR : JWT_SECRET n'est pas défini dans le fichier .env !");
            // Optionnel : process.exit(1); 
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