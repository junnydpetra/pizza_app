import prismaClient from "../../prisma/index"

class DetailUserService {
    async execute(user_id: string) {

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        })

        if (!user) {
            throw new Error("User not found!");
        }

        return user;
    }
}

export { DetailUserService }