import { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { User } from "../models/User";
import { hashPassword, validatePassword } from "../utils/bcrypt";
import {
  VerificationCode,
  VerificationCodeType,
} from "../models/VerificationCode";
import { randomUUID } from "crypto";
import { generateAccessToken, sendVerificationEmail } from "../utils";
import { sendPasswordResetEmail } from "../utils/mailer";
import { emailSlug } from "../constants";

export const signupValidator = [
  body("name", "Name is required").not().isEmpty().trim(),
  body("email", "Invalid email").isEmail(),
  body("password", "password cannot be empty").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
];

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Please enter the fields correctly",
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;
  try {
    const count = await User.countDocuments({ email });

    if (count > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    const verificationId = randomUUID();
    const verification = await VerificationCode.create({
      userId: savedUser._id,
      verificationCode: verificationId,
      type: VerificationCodeType.VERIFICATION,
    });

    await sendVerificationEmail(
      name,
      email,
      emailSlug.VERIFY_EMAIL,
      verification.verificationCode
    );

    res.status(200).json({
      msg: "Successfully signed up. Please click on the verification link sent to your email address to verify your account.",
      data: {
        user: {
          email: savedUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "We are facing some issues. Please try again later." });
  }
};

export const verifyEmailValidator = [
  param("verificationId", "Invalid verification code").isUUID(),
];

export const verifyEmail = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Invalid verification code",
      errors: errors.array(),
    });
  }

  const { verificationId } = req.params;

  try {
    const verification = await VerificationCode.findOne({
      verificationCode: verificationId,
      type: VerificationCodeType.VERIFICATION,
    });

    if (!verification) {
      return res.status(400).json({
        msg: "Invalid verification code",
      });
    }

    const user = await User.findById(verification.userId);

    if (!user) {
      return res.status(400).json({
        msg: "Invalid verification code",
      });
    }

    user.isVerified = true;
    await user.save();

    await VerificationCode.deleteOne({ _id: verification._id });

    res.status(200).json({
      msg: "Successfully verified your account. Please login to continue.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "We are facing some issues. Please try again later." });
  }
};

export const loginValidator = [
  body("email", "Invalid email").isEmail(),
  body("password", "password cannot be empty").not().isEmpty(),
];

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Please enter the fields correctly",
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        msg: "Please verify your account before logging in",
      });
    }

    const isMatch = await validatePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = generateAccessToken({
      _id: user._id.toString(),
    });

    res.status(200).json({
      msg: "Successfully logged in",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "We are facing some issues. Please try again later." });
  }
};

export const forgotPasswordValidator = [
  body("email", "Invalid email").isEmail(),
];

export const forgotPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Please enter the fields correctly",
      errors: errors.array(),
    });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const verificationId = randomUUID();
    const verification = await VerificationCode.create({
      userId: user._id,
      verificationCode: verificationId,
      type: VerificationCodeType.PASSWORD_RESET,
    });

    await sendPasswordResetEmail(
      user.name,
      email,
      emailSlug.RESET_PASSWORD,
      verification.verificationCode
    );

    res.status(200).json({
      msg: "Please click on the link sent to your email address to reset your password.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "We are facing some issues. Please try again later." });
  }
};

export const resetPasswordValidator = [
  param("verificationId", "Invalid verification code").isUUID(),
  body("password", "password cannot be empty").not().isEmpty(),
];

export const resetPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Invalid verification code",
      errors: errors.array(),
    });
  }

  const { verificationId } = req.params;
  const { password } = req.body;

  try {
    const verification = await VerificationCode.findOne({
      verificationCode: verificationId,
      type: VerificationCodeType.PASSWORD_RESET,
    });

    if (!verification) {
      return res.status(400).json({
        msg: "Invalid verification code",
      });
    }

    const user = await User.findById(verification.userId);

    if (!user) {
      return res.status(400).json({
        msg: "Invalid verification code",
      });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();

    await VerificationCode.deleteOne({ _id: verification._id });

    res.status(200).json({
      msg: "Successfully changed your password. Please login to continue.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "We are facing some issues. Please try again later." });
  }
};

export const resendVerificationEmailValidator = [
  body("email", "Invalid email").isEmail(),
];

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Please enter the fields correctly",
      errors: errors.array(),
    });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        msg: "Your account is already verified. Please login to continue.",
      });
    }

    // check if there is already a verification code for this user
    // delete it if it exists
    const verificationCount = await VerificationCode.countDocuments({
      userId: user._id,
      type: VerificationCodeType.VERIFICATION,
    });

    if (verificationCount > 0) {
      await VerificationCode.deleteMany({
        userId: user._id,
        type: VerificationCodeType.VERIFICATION,
      });
    }

    const verificationId = randomUUID();
    const verification = await VerificationCode.create({
      userId: user._id,
      verificationCode: verificationId,
      type: VerificationCodeType.VERIFICATION,
    });

    await sendVerificationEmail(
      user.name,
      email,
      emailSlug.VERIFY_EMAIL,
      verification.verificationCode
    );

    res.status(200).json({
      msg: "Resend verification email",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "We are facing some issues. Please try again later." });
  }
};
