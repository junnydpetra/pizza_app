import { Request, Response } from "express";
import { RemoveItemOrderService } from "../../services/order/RemoveItemOrderService";

class RemoveItemController {
    async handle(req: Request, res: Response) {
        const item_id = req.query.item_id as string;
        const removeItem = new RemoveItemOrderService;

        const item = await removeItem.execute({ item_id });

        res.status(200).json(item);
    }
}

export { RemoveItemController }