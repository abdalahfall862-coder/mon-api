import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb"; // <--- Indispensable pour MongoDB

export class UserService {
    private userRepository = AppDataSource.getMongoRepository(User);

    // 1. Création d'un utilisateur (Register)
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

    // 2. Connexion (Login)
    async login(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });
        
        if (!user) throw new Error("Utilisateur non trouvé");

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) throw new Error("Mot de passe incorrect");

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1h' }
        );

        return { token, user };
    }

    // 3. Récupérer tous les utilisateurs
    async findAll() {
        return await this.userRepository.find();
    }

    // --- NOUVELLES MÉTHODES POUR L'ÉTAPE 3 ---

    // 4. Récupérer un utilisateur par son ID
    async findOne(id: string) {
        // Pour MongoDB, on utilise l'ObjectId
        const user = await this.userRepository.findOneBy({ _id: new ObjectId(id) } as any);
        if (!user) throw new Error("Utilisateur non trouvé");
        return user;
    }

    // 5. Mettre à jour un utilisateur
    async update(id: string, userData: Partial<User>) {
        const userId = new ObjectId(id);

        // Si l'utilisateur change son mot de passe, on le hash
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        // On met à jour les champs fournis
        await this.userRepository.update(userId, userData);

        // On renvoie l'utilisateur mis à jour
        return await this.findOne(id);
    }

    // 6. Supprimer un utilisateur
    async delete(id: string) {
        const result = await this.userRepository.delete(new ObjectId(id));
        if (result.affected === 0) throw new Error("Utilisateur non trouvé ou déjà supprimé");
        return true;
    }
}