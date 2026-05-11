import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        console.log("1. Début login pour:", email);
        const user = await this.userRepository.findOneBy({ email });
        
        if (!user) throw new Error("Utilisateur non trouvé");

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("4. Mot de passe correct:", isMatch);
        
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
}