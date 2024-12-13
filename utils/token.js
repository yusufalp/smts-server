import jwt from "jsonwebtoken";

const tokenConfig = {
  access: { expiresIn: "8h" },
  refresh: { expiresIn: "30d" },
};

export function generateJwtToken(user, type = "access") {
  const config = tokenConfig[type] || tokenConfig.access;

  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    config
  );
}

export function decodeJwtToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
