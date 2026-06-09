import prismaClient from "../../prisma/index";

interface ListOrdersServiceProps {
    draft?: string;
}

class ListOrdersService {
    async execute({ draft }: ListOrdersServiceProps) {
        try {
            const orders = await prismaClient.order.findMany({
                where: {
                    draft: draft === "true" ? true : false
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true,
                    items: {
                        select: {
                            id: true,
                            amount: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    description: true,
                                    banner: true,
                                }
                            }
                        }
                    }
                }
            });

            return orders;
        } catch (error) {
            throw new Error("Failed to retrieve categories!");
        }
    }
}

export { ListOrdersService };