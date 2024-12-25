import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

import { ROLES } from "../enums/roles.js";
import { STATUSES } from "../enums/statuses.js";

// export const assignAdvisor = async (req, res, next) => {
//   const { _id } = req.params;

//   try {
//     if (!_id) {
//       throw new CustomError("Profile id is required", 404);
//     }

//     const profile = await Profile.findById(_id);

//     if (!profile) {
//       throw new CustomError("Profile not found", 404);
//     }

//     return res.status(200).json({
//       success: { message: "Profile found successfully" },
//       data: { profile },
//     });
//   } catch (error) {}
// };

// export const updateAdvisor = async (req, res, next) => {
//   const { advisorId, userId } = req.body;

//   try {
//     if (!advisorId) {
//       throw new CustomError("Advisor id is required", 400);
//     }

//     if (!userId) {
//       throw new CustomError("User id is required", 400);
//     }

//     const advisorProfile = await Profile.findOne(
//       { userId: advisorId },
//       "_id role"
//     );

//     if (!advisorProfile) {
//       throw new CustomError("Advisor not found", 404);
//     }

//     const advisorRole = advisorProfile.role;

//     if (
//       ROLES[advisorRole].key !== "mentor" &&
//       ROLES[advisorRole].key !== "coach"
//     ) {
//       throw new CustomError("Person is not an advisor", 400);
//     }

//     const advisorConfig = {
//       mentor: { "assigned.mentorId": advisorProfile._id },
//       coach: { "assigned.coachId": advisorProfile._id },
//     };

//     const updateData = advisorConfig[advisorRole];

//     const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
//       new: true,
//     });

//     if (!profile) {
//       throw new CustomError("Profile not found", 404);
//     }

//     return res.status(200).json({
//       success: { message: "Advisor updated successfully" },
//       data: { profile },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllProfiles = async (req, res, next) => {
  const { status, role, page = 1, limit = 5 } = req.query;

  const filters = {};

  if (status && status !== "all") {
    if (STATUSES[status]) {
      filters.status = STATUSES[status].key;
    } else {
      throw new CustomError(`Invalid status value`, 400);
    }
  }

  if (role && role !== "all") {
    if (ROLES[role]) {
      filters.role = ROLES[role].key;
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

    if (!profiles) {
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

export const updateProfileAttributes = async (req, res, next) => {
  const profileId = req.params._id;
  const { field, value } = req.body;

  try {
    if (!profileId) {
      throw new CustomError("User id is required", 400);
    }

    if (!field || !value) {
      throw new CustomError(`${field} and its value is required`, 400);
    }

    if (field === "status") {
      if (!STATUSES[value]) {
        throw new CustomError("Invalid status value", 400);
      }
    } else if (field === "role") {
      if (!ROLES[value]) {
        throw new CustomError("Invalid role value", 400);
      }
    }

    const updateData = { [field]: value };

    const profile = await Profile.findByIdAndUpdate(profileId, updateData, {
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

export const deleteProfile = async (req, res, next) => {};
