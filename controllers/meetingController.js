import Meeting from "../models/meetingModel.js";

export const createMeeting = async (req, res, next) => {
  const { mentorId, date, time, duration, notes } = req.body;

  try {
    const userId = req.user._id;

    const newMeeting = new Meeting({
      menteeId: userId,
      mentorId,
      date,
      time,
      duration,
      notesBy: { mentee: notes },
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

export const getMeetingsByUserId = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log("req.user :>> ", req.user);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { role } = req.user;

    let meetings;

    if (role === "mentor") {
      meetings = await Meeting.find({ mentorId: userId });
    } else if (role === "mentee") {
      meetings = await Meeting.find({ menteeId: userId });
    }

    res.status(200).json({
      success: { message: "Meetings retrieved" },
      data: { meetings },
    });
  } catch (error) {
    next(error);
  }
};
