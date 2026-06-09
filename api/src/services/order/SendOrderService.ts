import prismaClient from "../../prisma/index";

interface SendOrderProps {
    name: string;
    order_id: string;
}

class SendOrderService {
    async execute({ name, order_id }: SendOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: order_id,
                }
            });

            if (!order) {
                throw new Error("Order not found!");
            }

            const updateOrder = await prismaClient.order.update({
                where: {
                    id: order_id
                },
                data: {
                    draft: false,
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true,
                }
            });

            return updateOrder;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to send order!");
        }
    }
}

export { SendOrderService }