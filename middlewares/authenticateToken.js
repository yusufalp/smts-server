import CustomError from "../utils/CustomError.js";
import { decodeJwtToken } from "../utils/token.js";

export function authenticateToken(req, res, next) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new CustomError("Access Denied", 403);
    }

    const user = decodeJwtToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
