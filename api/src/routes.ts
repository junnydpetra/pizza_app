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
import { ListCategoryController } from "./controllers/category/ListCategoriesController";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { listProductByCategorySchema, productSchema } from "./schemas/productSchema";
import { ListProductController } from "./controllers/product/ListProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { ListProductByCategoryController } from "./controllers/product/ListProductByCategoryController";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { addItemSchema, createOrderSchema, deleteOrderSchema, detailOrderSchema, finishOrderSchema, removeItemSchema, sendOrderSchema } from "./schemas/orderSchema";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";

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

router.post("/order", isAuthenticated, validateSchema(createOrderSchema), new CreateOrderController().handle);
router.get("/orders", isAuthenticated, new ListOrdersController().handle);
router.post("/order/add", isAuthenticated, validateSchema(addItemSchema), new AddItemController().handle);
router.delete("/order/remove", isAuthenticated, validateSchema(removeItemSchema), new RemoveItemController().handle);
router.get("/order/details", isAuthenticated, validateSchema(detailOrderSchema), new DetailOrderController().handle)
router.put("/order/send", isAuthenticated, validateSchema(sendOrderSchema), new SendOrderController().handle)
router.put("/order/finish", isAuthenticated, validateSchema(finishOrderSchema), new FinishOrderController().handle);
router.delete("/order", isAuthenticated, validateSchema(deleteOrderSchema), new DeleteOrderController().handle);

export { router };