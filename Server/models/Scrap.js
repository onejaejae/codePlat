const mongoose = require("mongoose");

const scrapSchema = new mongoose.Schema(
  {
    // 스크랩한 유저
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    // 어떤 게시글을 스크랩 했는지
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    type: String,
  },
  { timestamps: true }
);

const Scrap = mongoose.model("Scrap", scrapSchema);
export default Scrap;
