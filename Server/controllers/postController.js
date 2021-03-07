import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import { jsonParse } from "../common/jsonParse";

export const postWrite = async (req, res) => {
  try {
    const { body, files } = req;
    const data = body;

    if (req.body.tag) {
      const tmp = req.body.tag;
      const curr = JSON.parse(tmp);
      data.tag = curr;
    }

    if (req.body.techStack) {
      const curr = jsonParse(req.body.techStack);
      data.techStack = curr;
    }

    if (files) {
      const array = files.map((file) => {
        return file.location;
      });
      data.fileUrl = array;

      const array2 = files.map((file) => {
        return file.originalname;
      });

      data.fileName = array2;
    }

    const post = await new Post(data);
    await post.save();

    const posts = await Post.findOne({ _id: post.id }).populate("writer");

    req.user.post.unshift(post.id);
    await req.user.save();

    return res.status(201).json({
      success: true,
      post: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
    });
  }
};

export const getPosts = async (req, res) => {
  const {
    query: { type, skip },
  } = req;

  const newSkip = parseInt(skip, 10);

  const findArgs = {};
  findArgs.type = type;

  if (req.query.term !== "undefined") {
    findArgs.title = { $regex: req.query.term };
  }

  if (req.query.location !== "전체") {
    findArgs.location = req.query.location;
  }

  if (req.query.techStack) {
    const techStack = req.query.techStack.split(",");
    findArgs.techStack = { $all: techStack };
  }

  try {
    const posts = await Post.find(findArgs)
      .sort({ createAt: -1 })
      .skip(newSkip)
      .limit(10)
      .populate("writer");

    res.status(200).json({
      success: true,
      posts,
      postSize: posts.length,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      error,
    });
  }
};

export const getPostDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const post = await Post.findById(id)
      .deepPopulate(["comments.likes", "comments.writer"])
      .populate("scraps")
      .populate("likes")
      .populate("writer");

    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      error,
    });
  }
};

export const deletePost = async (req, res) => {
  const {
    params: { id: _id },
  } = req;

  try {
    const post = await Post.findById(_id);
    const user = await User.findById(post.writer);

    // user가 작성한 post 목록 중 해당 post 삭제
    const postIndex = user.post.indexOf(_id);
    user.post.splice(postIndex, 1);
    await user.save();

    post.comments.forEach(async (value) => {
      // user가 작성한 댓글 목록 중 해당 댓글 삭제
      const commentIndex = user.comments.indexOf(value);
      user.comments.splice(commentIndex, 1);

      // 해당 post의 댓글 삭제
      await Comment.findByIdAndDelete({ _id: value });
    });

    await user.save();
    await Post.findOneAndDelete({ _id });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
    });
  }
};

export const updatePost = async (req, res) => {
  const {
    body: { id: _id },
    body,
    files,
  } = req;

  const update = body;
  update.createAt = Date.now();

  let array = [];
  let array2 = [];

  if (req.body.filePath && req.body.fileName) {
    const tmp = req.body.filePath;
    const curr = JSON.parse(tmp);

    array = curr.map((path) => {
      return path;
    });

    const tmp2 = req.body.fileName;
    const curr2 = JSON.parse(tmp2);

    array2 = curr2.map((name) => {
      return name;
    });
  }

  if (files) {
    files.forEach((file1) => {
      array.push(file1.location);
      array2.push(file1.originalname);
    });

    update.fileUrl = array;
    update.fileName = array2;
  }

  if (req.body.tag) {
    const curr = jsonParse(req.body.tag);
    update.tag = curr;
  }

  if (req.body.techStack) {
    const curr = jsonParse(req.body.techStack);
    update.techStack = curr;
  }

  try {
    const post = await Post.findOneAndUpdate({ _id }, update, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
};

export const getForum = async (req, res) => {
  const {
    query: { field, skip, type },
  } = req;

  const newSkip = parseInt(skip, 10);
  const findArgs = {};
  findArgs.type = "forum";
  findArgs.field = field;

  console.log("skip", skip);

  if (field === "전체") {
    delete findArgs.field;
  }

  if (req.query.term !== "undefined") {
    findArgs.title = { $regex: req.query.term };
  }

  try {
    if (type === "latest") {
      const posts = await Post.find(findArgs)
        .sort({
          createAt: -1,
        })
        .skip(newSkip)
        .limit(10)
        .populate("writer");

      console.log("postsize", posts.length);

      return res.status(200).json({
        success: true,
        posts,
        postSize: posts.length,
      });
    } else if (type === "views") {
      const posts = await Post.find(findArgs)
        .sort({
          views: -1,
          createAt: -1,
        })
        .skip(newSkip)
        .limit(10)
        .populate("writer");

      return res.status(200).json({
        success: true,
        posts,
        postSize: posts.length,
      });
    } else if (type === "comments") {
      const posts = await Post.aggregate([
        { $match: findArgs },
        {
          $lookup: {
            from: "users",
            localField: "writer",
            foreignField: "_id",
            as: "writer",
          },
        },
        {
          $project: {
            // object 형태로 준다
            writer: {
              $arrayElemAt: ["$writer", 0],
            },
            type: 1,
            title: 1,
            content: 1,
            fileUrl: 1,
            createAt: 1,
            views: 1,
            field: 1,
            tag: 1,
            comments: 1,
            likes: 1,
            scraps: 1,
            length: { $size: "$comments" },
          },
        },
        { $sort: { length: -1, createAt: -1 } },
        { $skip: newSkip },
        { $limit: 10 },
      ]);

      return res.status(200).json({
        success: true,
        posts,
        postSize: posts.length,
      });
    } else if (type === "likes") {
      const posts = await Post.aggregate([
        { $match: findArgs },
        {
          $lookup: {
            from: "users",
            localField: "writer",
            foreignField: "_id",
            as: "writer",
          },
        },
        {
          $project: {
            writer: {
              $arrayElemAt: ["$writer", 0],
            },
            type: 1,
            title: 1,
            content: 1,
            fileUrl: 1,
            createAt: 1,
            views: 1,
            field: 1,
            tag: 1,
            comments: 1,
            likes: 1,
            scraps: 1,
            length: { $size: "$likes" },
          },
        },
        { $sort: { length: -1, createAt: -1 } },
        { $skip: newSkip },
        { $limit: 10 },
      ]);

      return res.status(200).json({
        success: true,
        posts,
        postSize: posts.length,
      });
    } else if (type === "scraps") {
      const posts = await Post.aggregate([
        { $match: findArgs },
        {
          $lookup: {
            from: "users",
            localField: "writer",
            foreignField: "_id",
            as: "writer",
          },
        },
        {
          $project: {
            writer: {
              $arrayElemAt: ["$writer", 0],
            },
            type: 1,
            title: 1,
            content: 1,
            fileUrl: 1,
            createAt: 1,
            views: 1,
            field: 1,
            tag: 1,
            comments: 1,
            likes: 1,
            scraps: 1,
            length: { $size: "$scraps" },
          },
        },
        { $sort: { length: -1, createAt: -1 } },
        { $skip: newSkip },
        { $limit: 10 },
      ]);

      return res.status(200).json({
        success: true,
        posts,
        postSize: posts.length,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = {};

    const forum = await Post.aggregate([
      { $match: { type: "forum" } },
      {
        $lookup: {
          from: "users",
          localField: "writer",
          foreignField: "_id",
          as: "writer",
        },
      },
      {
        $project: {
          writer: {
            $arrayElemAt: ["$writer", 0],
          },
          type: 1,
          title: 1,
          content: 1,
          fileUrl: 1,
          createAt: 1,
          views: 1,
          field: 1,
          tag: 1,
          comments: 1,
          likes: 1,
          scraps: 1,
          length: { $size: "$likes" },
        },
      },
      { $sort: { length: -1, createAt: -1 } },
      { $limit: 8 },
    ]);
    posts.forum = forum;

    const study = await Post.find({ type: "study" })
      .populate("writer")
      .sort({ createAt: -1 })
      .limit(5);
    posts.study = study;

    const project = await Post.find({ type: "project" })
      .populate("writer")
      .sort({ createAt: -1 })
      .limit(5);
    posts.project = project;

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};
