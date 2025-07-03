import {Router} from "express";

import {
    createProduct,
    getProducts,
    getproductbyId,
    updateProducts,
    deleteProduct 
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
const router = Router()


router.route("/create").post(upload.single("image"), createProduct);
router.route("/products").get(getProducts)
router.route("/:id").get(getproductbyId)

export default router;