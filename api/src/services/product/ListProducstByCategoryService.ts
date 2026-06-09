import prismaClient from "../../prisma/index";

interface ListProducstByCategoryServiceProps {
    category_id?: string;
}

class ListProducstByCategoryService {
    async execute({ category_id }: ListProducstByCategoryServiceProps) {
        try {
            const category = await prismaClient.category.findUnique({
                where: {
                    id: category_id,
                },
            });

            if (!category) {
                throw new Error("Category not found!");
            }

            const products = await prismaClient.product.findMany({
                where: {
                    category_id: category_id,
                    disabled: true,
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    disabled: true,
                    category_id: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            });

            return products;
        } catch (error) {
            throw new Error("Failed to retrieve products in this category!");
        }
    }
}

export { ListProducstByCategoryService };