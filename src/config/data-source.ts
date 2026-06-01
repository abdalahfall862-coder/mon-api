import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// Utilisation de l'URL de Render ou repli sur le localhost pour ton PC
const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mon-api";

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: MONGO_URL,
    synchronize: true,
    logging: true,
    entities: [
        process.env.NODE_ENV === "production" ? "src/entities/*.js" : "src/entities/*.ts"
    ],
});