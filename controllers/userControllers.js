import User from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";

export const getUserById = async (req, res, next) => {
  const { _id } = req.params;

  if (_id) {
    throw new CustomError("Id is required", 400);
  }

  try {
    const user = await User.findById(_id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return res.status(200).json({
      success: { message: "User retrieved successfully" },
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
