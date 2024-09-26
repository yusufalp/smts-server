import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";

export const createMeeting = async (req, res, next) => {
  const { title, advisor, date, time, duration, notes } = req.body;
  const userId = req.user._id;

  const dateISO = new Date(`${date} ${time}`);

  // TODO: add more validations here

  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const profile = await Profile.findOne({ userId }, "_id");

    if (!profile) {
      throw new Error("Profile not found");
    }

    const learner = profile._id;

    const newMeeting = new Meeting({
      title,
      learner,
      date: dateISO,
      duration,
      advisor,
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

export const getMeetingsWith = async (req, res, next) => {
  const userId = req.user._id;
  const role = req.query.role;

  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new Error("Profile not found");
    }

    let meetings;

    if (role === "mentor" || role === "coach") {
      meetings = await Meeting.find(
        { advisor: profile._id },
        "title date duration learner"
      ).populate("learner", "name");
    } else
      meetings = await Meeting.find(
        { learner: profile._id },
        "title date duration advisor"
      ).populate("advisor", "name");

    res.status(200).json({
      success: { message: "Meetings retrieved" },
      data: { meetings },
    });
  } catch (error) {
    next(error);
  }
};
