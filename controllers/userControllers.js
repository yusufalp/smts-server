import User from "../models/userModel.js";

export const getUserById = async (req, res, next) => {
  const { _id } = req.params;

  if (_id) {
    throw new Error("Id is required");
  }

  try {
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      success: { message: "User retrieved successfully" },
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
