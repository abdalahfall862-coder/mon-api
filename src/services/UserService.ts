import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";

export class UserService {
    // On récupère le repository spécifique à MongoDB
    private userRepository = AppDataSource.getMongoRepository(User);

    async create(userData: Partial<User>) {
        const newUser = this.userRepository.create(userData);
        return await this.userRepository.save(newUser);
    }

    async findAll() {
        return await this.userRepository.find();
    }
}