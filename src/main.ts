import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
    console.log("❌ ERREUR : Le fichier .env n'est toujours pas lu !");
} else {
    console.log("✅ SUCCESS : La clé secrète est chargée !");
}

import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./config/data-source.js";
import userRoutes from "./routes/UserRoutes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
// Maintenant PORT ne sera pas undefined
const PORT = process.env.PORT || 3000; 

// ... le reste de ton code reste identique

app.use(express.json()); 
app.use(morgan("dev")); // LOGS : OK ✅

// On préfixe toutes nos routes par /api
app.use("/api", userRoutes);

app.use(errorMiddleware); 

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