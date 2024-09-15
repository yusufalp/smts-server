import User from "../models/userModel.js";

export const getUserById = async (req, res, next) => {
  const { _id } = req.params;

  if (_id) {
    return res.status(400).json({
      error: { message: "Id is required" },
    });
  }

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({
        error: { message: "User not found" },
      });
    }

    res.status(200).json({
      success: { message: "User retrieved successfully" },
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
