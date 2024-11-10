import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

export const createMeeting = async (req, res, next) => {
  const { title, advisor, date, time, duration, notes } = req.body;
  const userId = req.user._id;

  const dateISO = new Date(`${date} ${time}`);

  // TODO: add more validations here

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId }, "_id");

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const learner = profile._id;

    const newMeeting = new Meeting({
      title,
      learner,
      advisor,
      date: dateISO,
      duration,
      notes,
    });

    await newMeeting.save();

    return res.status(201).json({
      status: { message: "A new meeting is created" },
      data: { meeting: newMeeting },
    });
  } catch (error) {
    next(error);
  }
};

export const getMeetings = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }
    const role = profile.role;

    const filter = {
      mentor: { advisor: profile._id },
      coach: { advisor: profile._id },
      mentee: { learner: profile._id },
    };

    if (!filter[role]) {
      throw new CustomError(`Invalid role: ${role}`, 400);
    }

    const meetings = await Meeting.find(filter[profile.role])
      .populate("learner", "name")
      .populate("advisor", "name")
      .lean();

    if (!meetings.length) {
      throw new CustomError("Meetings not found", 404);
    }

    return res.status(200).json({
      success: { message: "Meetings found" },
      data: { meetings },
    });
  } catch (error) {
    next(error);
  }
};

export const getMeetingById = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    if (!meetingId) {
      throw new CustomError("Meeting id is required", 400);
    }

    const meeting = await Meeting.findById(meetingId)
      .populate("learner", "name")
      .populate("advisor", "name")
      .lean();

    if (!meeting) {
      throw new CustomError("Meeting not found", 404);
    }

    return res.status(200).json({
      success: { message: "Meeting is found" },
      data: { meeting },
    });
  } catch (error) {
    next(error);
  }
};
