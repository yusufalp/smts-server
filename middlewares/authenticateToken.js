import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  try {
    const token = req.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new Error(err);
      }

      req.user = user;

      next();
    });
  } catch (error) {
    next(error);
  }
}
