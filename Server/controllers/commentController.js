import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";

export const postComment = async (req, res) => {
  try {
    const {
      body: { postId },
    } = req;

    const post = await Post.findById(postId);

    const data = req.body;
    data.writer = req.user.id;

    // 1) Comment 생성
    const comment = new Comment(data);
    await comment.save();

    // 2) user 에 저장
    req.user.comments.unshift(comment.id);
    await req.user.save();

    // 3) post 에 저장
    post.comments.push(comment.id);
    await post.save();

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const {
      body: { commentId },
      body,
    } = req;

    const update = body;

    const comment = await Comment.findOneAndUpdate({ _id: commentId }, update, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error,
    });
  }
};

export const updateParentComment = async (req, res) => {
  const {
    body: { id },
  } = req;

  try {
    const comment = await Comment.findById(id);
    comment.overwrite({
      content: "삭제된 댓글 입니다",
      isDelete: true,
      postId: comment.postId,
      writer: comment.writer,
    });
    await comment.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    // 1) coomment 찾기
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    // 2) post 의 comments 에서 해당 댓글 삭제
    const post = await Post.findById(comment.postId);

    const indexPost = post.comments.indexOf(commentId);
    post.comments.splice(indexPost, 1);
    await post.save();

    // 3) user 의 comments 에서 해당 댓글 삭제
    const user = await User.findById(comment.writer);
    const indexUser = await user.comments.indexOf(commentId);
    user.comments.splice(indexUser, 1);
    await user.save();

    // 4) 댓글 DB 삭제
    await Comment.findByIdAndDelete(commentId);
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
