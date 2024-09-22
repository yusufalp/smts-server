import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";

export const createMeeting = async (req, res, next) => {
  const { title, mentorId, date, time, duration, notes } = req.body;
  const userId = req.user._id;

  const dateISO = new Date(`${date} ${time}`);

  try {
    const newMeeting = new Meeting({
      title,
      userId,
      participants: [mentorId],
      date: dateISO,
      duration,
      notes: { by: userId, note: notes },
    });

    await newMeeting.save();

    res.status(200).json({
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
      throw new Error("Unauthorized");
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const { role } = profile;

    let meetings;

    if (role === "mentee") {
      meetings = await Meeting.find({ userId: userId });
    } else {
      meetings = await Meeting.find({ participants: userId });
    }

    res.status(200).json({
      success: { message: "Meetings retrieved" },
      data: { meetings },
    });
  } catch (error) {
    next(error);
  }
};
