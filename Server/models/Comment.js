const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    // 댓글 작성자
    writer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    // 댓글 내용
    content: {
      type: String,
      required: "content is required",
    },
    // 어떤 게시글에 댓글을 남겼는지
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Post",
    },
    // 작성 시간
    createAt: {
      type: Date,
      default: Date.now,
    },
    //어떤 댓글에 댓글 남겼는지(대댓글의 경우 필요)
    commentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    // 댓글 익명 여부
    secretComment: {
      type: Boolean,
      default: false,
    },
    // 스터디, 프로젝트, 포럼 분류 기준
    type: {
      type: String,
    },
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Like",
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
