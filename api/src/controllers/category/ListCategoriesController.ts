import { Request, Response } from "express";
import { ListCategoriesService } from "../../services/category/ListCategoriesService";

class ListCategoryController {
    async handle(req: Request, res: Response) {
        const listCategory = new ListCategoriesService();

        const categories = await listCategory.execute();

        res.status(200).json(categories);
    }
}

export { ListCategoryController }