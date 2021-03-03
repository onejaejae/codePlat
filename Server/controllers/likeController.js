import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import Like from "../models/Like";

export const upLike = async (req, res) => {
  let like;
  let obj;

  try {
    // 1) post, comment 객체 찾기
    const {
      body: { type, id },
    } = req;

    // 2) like 생성
    if (type === "forum") {
      obj = await Post.findById(id);

      like = await Like.create({
        userId: req.user.id,
        postId: id,
        type,
      });
    } else {
      obj = await Comment.findById(id);

      like = await Like.create({
        userId: req.user.id,
        commentId: id,
        type,
      });
    }

    // 3) user 에 저장
    req.user.likes.push(like.id);
    await req.user.save();

    // 4) post / comment 에 저장
    obj.likes.push(like.id);
    await obj.save();

    return res.status(201).json({
      success: true,
      like,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error,
    });
  }
};

export const unLike = async (req, res) => {
  let obj;
  let objId;

  const {
    params: { id },
  } = req;

  try {
    // 1) like 객체 찾기
    const like = await Like.findById(id);

    // 2) post / comment 에서 like 지우기
    if (like.type === "forum") {
      objId = like.postId;
      obj = await Post.findById(objId);
    } else {
      objId = like.commentId;
      obj = await Comment.findById(objId);
    }

    const indexObj = obj.likes.indexOf(id);

    obj.likes.splice(indexObj, 1);
    await obj.save();

    // 3) user 의 like 에서 해당 like 지우기
    const user = await User.findById(like.userId);
    const indexUser = await user.likes.indexOf(id);

    user.likes.splice(indexUser, 1);
    await user.save();

    // 4) like DB 삭제
    await Like.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
};
