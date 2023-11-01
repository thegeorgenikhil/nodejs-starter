import express from "express";
import {
  forgotPassword,
  forgotPasswordValidator,
  login,
  loginValidator,
  resendVerificationEmail,
  resendVerificationEmailValidator,
  resetPassword,
  resetPasswordValidator,
  signup,
  signupValidator,
  verifyEmail,
  verifyEmailValidator,
} from "../controllers/auth";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/verify-email/:verificationId", verifyEmailValidator, verifyEmail);
router.post(
  "/resend-verification",
  resendVerificationEmailValidator,
  resendVerificationEmail
);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/reset-password/:verificationId", resetPasswordValidator, resetPassword);

export { router as AuthRouter };
