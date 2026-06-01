import "reflect-metadata";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors"; 
import { AppDataSource } from "./config/data-source.js";
import userRoutes from "./routes/UserRoutes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const SERVER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

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
                url: SERVER_URL,
                description: process.env.RENDER_EXTERNAL_URL ? "Serveur de Production (Render)" : "Serveur Local",
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
        console.log("🔄 Tentative de connexion à MongoDB...");
        await AppDataSource.initialize();
        console.log("📦 MongoDB est connecté avec succès !");

        if (!process.env.JWT_SECRET) {
            console.warn("⚠️ ATTENTION : JWT_SECRET n'est pas défini dans l'environnement !");
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur actif sur : ${SERVER_URL}`);
            console.log(`📑 Documentation disponible sur : ${SERVER_URL}/api-docs`);
        });
    } catch (error) {
        console.error("❌ ÉCHEC CRITIQUE DU DÉMARRAGE :", error);
        process.exit(1); // Force le processus à s'arrêter proprement pour que Render affiche le log
    }
}

// Capture des erreurs globales hors du flux asynchrone principal
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Promesse non gérée rejetée :", reason);
    process.exit(1);
});

start();