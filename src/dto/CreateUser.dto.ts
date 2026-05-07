import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username!: string;

    @IsEmail({}, { message: "L'email n'est pas valide" })
    email!: string;

    @IsString()
    @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    password!: string;
}