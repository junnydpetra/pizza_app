import { Request, Response } from "express";
import { ListProductsService } from "../../services/product/ListProductsService";

class ListProductController {
    async handle(req: Request, res: Response) {
        const disabled = req.query.disabled as string;
        const listProduct = new ListProductsService();

        const products = await listProduct.execute({
            disabled: disabled,
        });

        res.status(200).json(products);
    }
}

export { ListProductController }