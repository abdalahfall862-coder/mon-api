import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export class UserService {
    private userRepository = AppDataSource.getMongoRepository(User);
    
    // 1. Inscription
    async register(userData: Partial<User>) {
        const { password, email, username } = userData;
        if (!password || !email || !username) {
            throw new Error("Champs obligatoires manquants");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.userRepository.create({
            username: username as string,
            email: email as string,
            password: hashedPassword
        });

        return await this.userRepository.save(newUser);
    }

    // 2. Connexion
    async login(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new Error("Utilisateur non trouvé");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Mot de passe incorrect");

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET || "ma_cle_secrete_de_secours", 
            { expiresIn: '1h' }
        );

        return { token, user };
    }

    // 3. Récupérer tous les utilisateurs
    async findAll() {
        return await this.userRepository.find();
    }

    // 4. Récupérer UN utilisateur par ID
    async findOne(id: string) {
        try {
            const user = await this.userRepository.findOneBy({ 
                _id: new ObjectId(id) 
            } as any);
            
            return user;
        } catch (error) {
            throw new Error("Format d'ID invalide");
        }
    }

    // 5. Mettre à jour
    async update(id: string, userData: Partial<User>) {
        try {
            const userId = new ObjectId(id);

            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            const result = await this.userRepository.update(userId, userData);
            
            if (result.affected === 0) {
                return null;
            }

            return await this.findOne(id);
        } catch (error) {
            throw new Error("Format d'ID invalide");
        }
    }

    // 6. Supprimer
    async delete(id: string) {
        try {
            const result = await this.userRepository.delete(new ObjectId(id));
            if (result.affected === 0) throw new Error("Utilisateur non trouvé");
            return true;
        } catch (error: any) {
            if (error.message === "Utilisateur non trouvé") {
                throw error;
            }
            throw new Error("Format d'ID invalide");
        }
    }
}