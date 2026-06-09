import prismaClient from "../../prisma/index";

interface RemoveItemProps {
    item_id: string;
}

class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemProps) {
        try {
            const itemExists = await prismaClient.item.findFirst({
                where: {
                    id: item_id,
                },
            })

            if (!itemExists) {
                throw new Error("Item not found!");
            }

            await prismaClient.item.delete({
                where: {
                    id: item_id
                },
            })

            return { message: "Item successfully deleted!" }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to delete item!");
        }
    }
}

export { RemoveItemOrderService }