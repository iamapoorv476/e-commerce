import { Router } from "express";
import {
  loginUser,
  changeOldPassword,
  registerUser,
  getCurrentUser
} from "../controllers/user.controller.js"; 

 import { verifyJWT } from "../middlewares/auth.middleware.js";

 const router = Router()

 router.route("/register").post(registerUser)
 router.route("/login").post(loginUser)


 export default router
 