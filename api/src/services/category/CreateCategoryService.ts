import prismaClient from "../../prisma/index";

interface CreateCategoryProps {
    name: string;
}

class CreateCategoryService {
    async execute({ name }: CreateCategoryProps) {
        try {

            const category = await prismaClient.category.create({
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                }
            });

            return category;

        } catch (error) {
            throw new Error("Failed to create category!");
        }
    }
}

export { CreateCategoryService }