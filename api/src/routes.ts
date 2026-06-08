import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAdmin } from "./middlewares/isAdmin";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { categorySchema } from "./schemas/categorySchema";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { listProductByCategorySchema, productSchema } from "./schemas/productSchema";
import { ListProductController } from "./controllers/product/ListProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { ListProductByCategoryController } from "./controllers/product/ListProductByCategoryController";

const router = Router();
const upload = multer(uploadConfig);

router.post("/user", validateSchema(createUserSchema), new CreateUserController().handle);
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle);

router.get("/me", isAuthenticated, new DetailUserController().handle)

router.post("/category", isAuthenticated, isAdmin, validateSchema(categorySchema), new CreateCategoryController().handle);
router.get("/categories", isAuthenticated, new ListCategoryController().handle);

router.post("/product",
    isAuthenticated,
    isAdmin,
    upload.single('file'),
    validateSchema(productSchema),
    new CreateProductController().handle
);
router.get("/products", isAuthenticated, new ListProductController().handle);
router.delete("/product", isAuthenticated, isAdmin, new DeleteProductController().handle);
router.get("/category/product", isAuthenticated, validateSchema(listProductByCategorySchema), new ListProductByCategoryController().handle);


export { router };