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

export const getAdvisors = async (req, res, next) => {
  try {
    const advisors = await Profile.find(
      { $or: [{ role: "mentor" }, { role: "coach" }], profileStatus: "active" },
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
  const { advisorId } = req.query;

  try {
    if (!_id) {
      throw new CustomError("Learner id is required", 400);
    }

    const learner = await Profile.findById(_id);

    if (!learner) {
      throw new CustomError("Learner not found", 404);
    }

    // check if the learner is actually assigned to the requester
    if (
      learner?.assigned?.mentor?.toString() !== advisorId &&
      learner?.assigned?.coach?.toString() !== advisorId
    ) {
      throw new CustomError("This learner is not assigned to you", 401);
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
  const { page = 1, limit = 5 } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 100);

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId }, "_id");

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const filters = {
      profileStatus: "active",
      $or: [
        { "assigned.mentor": profile._id },
        { "assigned.coach": profile._id },
      ],
    };

    const learners = await Profile.find(filters)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalCount = await Profile.countDocuments(filters);

    if (!learners) {
      throw new CustomError("Learners not found", 404);
    }

    return res.status(200).json({
      success: { message: "Learners retrieved successfully" },
      data: {
        learners,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          currentPage: pageNum,
          pageSize,
        },
      },
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
