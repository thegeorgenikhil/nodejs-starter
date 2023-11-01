import mongoose, { Document, Schema } from "mongoose";

export type TVerificationCode = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  verificationCode: string;
};

export interface IVerificationCode extends TVerificationCode, Document {
  _id: mongoose.Types.ObjectId;
}

export enum VerificationCodeType {
  VERIFICATION = "verification",
  PASSWORD_RESET = "password-reset",
}

const verificationCodeSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    verificationCode: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(VerificationCodeType),
      default: VerificationCodeType.VERIFICATION,
    },
  },
  {
    timestamps: true,
  }
);

export const VerificationCode = mongoose.model<IVerificationCode>(
  "VerificationCode",
  verificationCodeSchema
);
