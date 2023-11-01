import jwt from "jsonwebtoken";

export type JWTPayload = {
  _id: string;
};

export function generateAccessToken(payload: JWTPayload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: "48h",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.TOKEN_SECRET as string) as JWTPayload;
}
