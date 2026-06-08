import { hash } from "bcryptjs";
import prismaClient from "../../prisma"; "../../prisma/index";

interface CreateUserProps{
    name: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute({ name, email, password }: CreateUserProps){

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (userAlreadyExists?.email) {
            throw new Error("Error! Email already registered.");
            
        }

        const passwordHash = await hash(password, 8)
        
        const user = await prismaClient.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
        });

        return user;
    }
}

export { CreateUserService }