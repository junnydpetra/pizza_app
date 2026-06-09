import { Request, Response } from "express";
import { ListProducstByCategoryService } from "../../services/product/ListProducstByCategoryService";

class ListProductByCategoryController {
    async handle(req: Request, res: Response) {
        const category_id = req.query.category_id as string;
        const listProductByCategory = new ListProducstByCategoryService();

        const products = await listProductByCategory.execute({
            category_id: category_id,
        });

        res.status(200).json(products);
    }
}

export { ListProductByCategoryController }