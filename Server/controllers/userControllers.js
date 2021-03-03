import bcrypt from "bcrypt";
import { generateHash } from "../common/generateHash";
import Post from "../models/Post";
import User from "../models/User";

export const getProfile = (req, res) => {
  try {
    return res.status(200).json({
      suceess: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
    });
  }
};

export const getUserActivity = async (req, res) => {
  const {
    params: { id: _id },
    query: { type, sort },
  } = req;

  try {
    const userActivities = await User.findOne(
      { _id },
      { _id: 0, [sort]: 1 }
    ).populate({
      path: sort,
      populate: { path: "writer" },
    });

    let activities = [];

    if (userActivities[sort]) {
      activities = userActivities[sort].filter(
        (activity) => activity.type === type
      );
    }

    if (sort === "comments" || sort === "scraps") {
      const postIds = activities.map((activity) => activity.postId);

      const posts = await Post.find({ _id: { $in: postIds } }).populate(
        "writer"
      );

      return res.status(200).json({
        suceess: true,
        activities,
        posts,
      });
    }

    return res.status(200).json({
      suceess: true,
      activities,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserDetail = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      suceess: true,
      user: req.user,
    });
  } else {
    return res.status(400).json({
      suceess: false,
    });
  }
};

export const postEditProfile = async (req, res) => {
  const { body, files } = req;

  const update = body;

  if (req.body.avatar === "null") {
    update.avatarUrl = "";
  }

  if (req.body.techStack) {
    const tmp = req.body.techStack;
    const curr = JSON.parse(tmp);
    update.techStack = curr;
  }

  if (files.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    const length = files.length;
    update.avatarUrl = files[length - 1].location;
  }

  try {
    const user = await User.findOneAndUpdate({ _id: req.user.id }, update, {
      new: true,
    });

    return res.status(200).json({
      suceess: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      suceess: false,
      error,
    });
  }
};

export const postChangePassword = async (req, res) => {
  const {
    body: { password, newPassword },
  } = req;

  try {
    const user = await User.findById({ _id: req.user.id });

    if (!user.password) {
      return res.status(200).end();
    }

    bcrypt.compare(password, user.password, async (err, isMatch) => {
      if (err) {
        return res.status(400).end();
      }

      if (!isMatch) {
        return res.status(200).json({
          message: "비밀번호가 일치하지 않습니다",
        });
      }

      const hash = await generateHash(newPassword);

      await User.findOneAndUpdate({ _id: req.user.id }, { password: hash });

      return res.status(200).json({
        suceess: true,
      });
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
    });
  }
};

export const deleteSecession = async (req, res) => {
  const {
    params: { id: _id },
  } = req;

  try {
    await User.findOneAndDelete({ _id });

    return res.status(200).json({
      suceess: true,
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      error,
    });
  }
};
