import Profile from "../models/profileModel.js";

async function getRole(userId) {
  try {
    const userProfile = await Profile.findOne({ userId }, "role");

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    return userProfile.role;
  } catch (error) {
    throw new Error(`Failed to retrieve user role: ${error.message}`);
  }
}

export function authorizeRoles(allowedRoles) {
  return async function (req, res, next) {
    try {
      const role = await getRole(req.user._id);

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const authorizeAdmin = authorizeRoles(["admin"]);
export const authorizeAdvisor = authorizeRoles(["mentor", "coach"]);
