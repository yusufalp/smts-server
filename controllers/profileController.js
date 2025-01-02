import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

export const createProfile = async (req, res, next) => {
  const userId = req.user._id;
  const { firstName, lastName, email } = req.body;

  try {
    if (!firstName || !lastName || !email) {
      throw new CustomError(`Missing required fields`, 400);
    }

    const profile = new Profile({
      userId,
      name: { firstName, lastName },
      email,
    });

    await profile.save();

    return res.status(201).json({
      success: { message: "A new profile is created" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdvisors = async (req, res, next) => {
  try {
    const advisors = await Profile.find(
      { $or: [{ role: "mentor" }, { role: "coach" }] },
      "name email"
    ).lean();

    if (!advisors) {
      throw new CustomError(`Advisors not found`, 404);
    }

    return res.status(200).json({
      success: { message: "Advisors found" },
      data: { advisors },
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedAdvisors = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const advisors = await Profile.findOne({ userId }, "assigned")
      .populate("assigned.mentor", "name")
      .populate("assigned.coach", "name")
      .lean();

    if (!advisors) {
      throw new CustomError("Assigned advisors not found", 404);
    }

    return res.status(200).json({
      success: { message: "Advisors populated successfully" },
      data: { advisors },
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedLearnerById = async (req, res, next) => {
  const { _id } = req.params;

  try {
    if (!_id) {
      throw new CustomError("Profile id is required", 400);
    }

    const learner = await Profile.findById(_id);

    if (!learner) {
      throw new CustomError("Learner not found", 404);
    }

    return res.status(200).json({
      success: { message: "Learner found successfully" },
      data: { learner },
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedLearners = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId }, "_id");

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const learners = await Profile.find({
      status: "active",
      $or: [
        { "assigned.mentorId": profile._id },
        { "assigned.coachId": profile._id },
      ],
    }).lean();

    if (!learners) {
      throw new CustomError("Learners not found", 404);
    }

    return res.status(200).json({
      success: { message: "Learners retrieved successfully" },
      data: { learners },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId }).lean();

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Profile found successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const userId = req.user._id;

  const { field, value } = req.body;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    if (!field || !value) {
      throw new CustomError(`${field} and its value is required`, 400);
    }

    const updateData = {};

    if (field === "address") {
      updateData[field] = {
        street: {
          line1: value.line1,
          line2: value.line2,
        },
        city: value.city,
        state: value.state,
        postalCode: value.postalCode,
        country: "US",
      };
    } else if (field === "links") {
      updateData[field] = {
        portfolioUrl: value.portfolioUrl,
        linkedinUrl: value.linkedinUrl,
        githubUrl: value.githubUrl,
      };
    } else if (field === "about") {
      if (!value.firstName) {
        throw new CustomError("First name is required", 400);
      }
      updateData.name = {
        firstName: value.firstName,
        middleName: value.middleName,
        lastName: value.lastName,
      };
      updateData.bio = value.bio;
    } else if (field === "contact") {
      updateData.email = value.email;
      updateData.phoneNumber = value.phoneNumber;
    } else {
      updateData[field] = value;
    }

    console.log("updateData :>> ", updateData);

    const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: `${field} updated successfully` },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};
