import { decodeJwtToken } from "../utils/token";

export function authenticateToken(req, res, next) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new Error("Token is missing");
    }

    const user = decodeJwtToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
