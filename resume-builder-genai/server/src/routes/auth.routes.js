import { Router } from "express";
import authController from "../controllers/auth.controller.js";
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
authRouter.post("/register", authController.registerUserController);

/**
 * -------------------------------------------------------------
 * @route   POST /api/auth/login
 * @desc    Authenticate user using email and password
 * @access  Public
 * @body    {email, password}
 * @controller loginUserController
 * -------------------------------------------------------------
 */
authRouter.post("/login", authController.loginUserController);

/**
 * -------------------------------------------------------------
 * @route   POST /api/auth/logout
 * @desc    Logout user by clearing auth cookie and blacklisting JWT
 * @access  Public
 * @middleware none
 * @controller logoutUserController
 * -------------------------------------------------------------
 */
authRouter.post("/logout", authController.logoutUserController);

/**
 * -------------------------------------------------------------
 * @route   GET /api/auth/get-me
 * @desc    Get currently authenticated user's profile
 * @access  Private
 * @middleware authUser
 * @controller getMeController
 * -------------------------------------------------------------
 */
authRouter.get("/get-me", authUser, authController.getMeController);

export default authRouter;
