import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();

const app = express();
app.use(express.json()); // Pour que l'API puisse lire le JSON envoyé

// On préfixe toutes nos routes par /api
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await AppDataSource.initialize();
        console.log("📦 MongoDB est connecté !");

        app.listen(PORT, () => {
            console.log(`🚀 Serveur actif sur : http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Échec du démarrage :", error);
    }
}

start();