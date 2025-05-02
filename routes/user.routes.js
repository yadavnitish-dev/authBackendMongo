import express from "express";
import { registerUser,verifyUser, login, getMe, logout } from "../controller/user.controller.js";
import { isLogedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/register", registerUser);

router.post("/register",registerUser);

router.get("/verify/:token", verifyUser);

router.post("/login", login);

router.get("/me",isLogedIn, getMe);

router.get("/logout", isLogedIn, logout);


export default router;
