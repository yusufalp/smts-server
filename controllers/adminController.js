import Meeting from "../models/meetingModel";

export const getAllMeetings = async (req, res, next) => {
  try {
    const allMeetings = await Meeting.find();

    res.status(200).json({
      success: { message: "All meetings retrieved successfully" },
      data: { allMeetings },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  try {
    const allProfiles = await Profile.find();

    res.status(200).json({
      success: { message: "All profiles is successfully retrieved" },
      data: { allProfiles },
    });
  } catch (error) {
    next(error);
  }
};
