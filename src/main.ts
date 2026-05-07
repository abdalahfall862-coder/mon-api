import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source.js";
import userRoutes from "./routes/UserRoutes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js"; // Importé ici

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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