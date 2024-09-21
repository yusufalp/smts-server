import jwt from "jsonwebtoken";

export function generateToken(user, tokenType) {
  // Expiration is 1d by default except if it is a refresh token
  const expiresIn = tokenType === "refresh" ? "30d" : "1d";

  const tokenUser = JSON.parse(JSON.stringify(user));
  const { password, ...userWithoutPassword } = tokenUser;

  return jwt.sign(userWithoutPassword, process.env.JWT_SECRET, { expiresIn });
}

export function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
