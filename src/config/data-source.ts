import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URL || "mongodb://localhost:27017/mon-projet",
    synchronize: true,
    logging: true,
    entities: [User],
});
