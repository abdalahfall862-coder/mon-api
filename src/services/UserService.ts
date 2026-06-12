import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
    private userRepository = AppDataSource.getMongoRepository(User);

    // 1. Inscription
    async register(userData: { name: string; email: string; password: string; role?: string }) {
        const { password, email, name, role } = userData;

        if (!password || !email || !name) {
            throw new Error("Champs obligatoires manquants");
        }

        // Vérifier si l'email existe déjà
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Email déjà utilisé");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: (role as UserRole) || UserRole.CUSTOMER
        });

        return await this.userRepository.save(newUser);
    }

    // 2. Connexion
    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new Error("Utilisateur non trouvé");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Mot de passe incorrect");

        const token = jwt.sign(
            { id: user.id.toString(), email: user.email, role: user.role },
            process.env.JWT_SECRET || "ma_cle_secrete_de_secours",
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user as any;
        return { token, user: userWithoutPassword };
    }

    // 3. Récupérer tous les utilisateurs
    async findAll() {
        return await this.userRepository.find();
    }

    // 4. Récupérer UN utilisateur par ID
    async findOne(id: string) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            return user;
        } catch (error) {
            throw new Error("Format d'ID invalide");
        }
    }

    // 5. Mettre à jour
    async update(id: string, userData: Partial<User>) {
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        await this.userRepository.update(id, userData);
        return await this.findOne(id);
    }

    // 6. Supprimer
    async delete(id: string) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) throw new Error("Utilisateur non trouvé");
        return true;
    }
}