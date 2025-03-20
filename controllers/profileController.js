import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

import { ROLES } from "../constants/roles.js";
import { STATUSES } from "../constants/statuses.js";

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
      { $or: [{ role: "mentor" }, { role: "coach" }], status: "active" },
      "name email"
    ).lean();

    if (!advisors.length) {
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

    // Validate if profileId and advisorId are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid profileId format");
    }
    if (!mongoose.Types.ObjectId.isValid(advisorId)) {
      throw new Error("Invalid advisorId format");
    }

    // Check if the advisor (mentor or coach) exists
    const advisorExists = await Profile.exists({ _id: advisorId });
    if (!advisorExists) {
      throw new Error("Advisor profile not found");
    }

    const learner = await Profile.findOne({
      _id,
      $or: [{ "assigned.mentor": advisorId }, { "assigned.coach": advisorId }],
    });

    if (!learner) {
      throw new CustomError("Learner not found or assigned to you", 404);
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
      status: "active",
      role: "mentee",
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

    if (!learners.length) {
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
      throw new CustomError("Field and its value is required", 400);
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

export const getAllProfiles = async (req, res, next) => {
  const { firstName, lastName, status, role, page = 1, limit = 5 } = req.query;

  const filters = {};

  if (firstName) {
    filters["name.firstName"] = { $regex: firstName, $options: "i" };
  }

  if (lastName) {
    filters["name.lastName"] = { $regex: lastName, $options: "i" };
  }

  if (status && status !== "all") {
    if (STATUSES[status]) {
      filters.status = status;
    } else {
      throw new CustomError(`Invalid status value`, 400);
    }
  }

  if (role && role !== "all") {
    if (ROLES[role]) {
      filters.role = role;
    } else {
      throw new CustomError(`Invalid role value`, 400);
    }
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 100);

  try {
    const profiles = await Profile.find(filters)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean();

    if (!profiles.length) {
      throw new CustomError("No profiles found", 404);
    }

    const totalCount = await Profile.countDocuments(filters);

    return res.status(200).json({
      success: { message: "All profiles is successfully retrieved" },
      data: {
        profiles,
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

export const getProfileById = async (req, res, next) => {
  const profileId = req.params._id;

  try {
    if (!profileId) {
      throw new CustomError("Profile id is required", 400);
    }

    const profile = await Profile.findById(profileId);

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Profile found" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileById = async (req, res, next) => {
  const profileId = req.params._id;
  const { fields } = req.body;

  try {
    if (!profileId) {
      throw new CustomError("User id is required", 400);
    }

    for (let key in fields) {
      if (key === "status") {
        if (!STATUSES[fields[key]]) {
          throw new CustomError("Invalid status value", 400);
        }
      }

      if (key === "role") {
        if (!ROLES[fields[key]]) {
          throw new CustomError("Invalid role value", 400);
        }
      }
    }

    const profile = await Profile.findByIdAndUpdate(profileId, fields, {
      new: true,
    });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: `Profile updated successfully` },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {};
