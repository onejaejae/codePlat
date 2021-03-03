const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    // 좋아요한 유저
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    // 어떤 게시글을 좋아요 했는지
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    // 어떤 댓글을 좋아요 했는지
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    // forum인지 comment인지 구분
    type: String,
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);
export default Like;
