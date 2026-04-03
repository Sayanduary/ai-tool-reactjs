import { Router } from "express";
import {
    getMeController,
    loginUserController,
    logoutUserController,
    registerUserController,
} from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * -------------------------------------------------------------
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 * @body    {username, email, password}
 * @controller registerUserController
 * -------------------------------------------------------------
 */
authRouter.post("/register", registerUserController);

/**
 * -------------------------------------------------------------
 * @route   POST /api/auth/login
 * @desc    Authenticate user using email and password
 * @access  Public
 * @body    {email, password}
 * @controller loginUserController
 * -------------------------------------------------------------
 */
authRouter.post("/login", loginUserController);

/**
 * -------------------------------------------------------------
 * @route   POST /api/auth/logout
 * @desc    Logout user by clearing auth cookie and blacklisting JWT
 * @access  Public
 * @middleware none
 * @controller logoutUserController
 * -------------------------------------------------------------
 */
authRouter.post("/logout", logoutUserController);

/**
 * -------------------------------------------------------------
 * @route   GET /api/auth/get-me
 * @desc    Get currently authenticated user's profile
 * @access  Private
 * @middleware authUser
 * @controller getMeController
 * -------------------------------------------------------------
 */
authRouter.get("/get-me", authUser, getMeController);

export default authRouter;
