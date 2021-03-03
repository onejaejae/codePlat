const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const postSchema = new mongoose.Schema(
  {
    // 작성자
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // type는 스터디, 프로젝트, 포럼글을 구별하는 기능을 한다
    type: String,
    // 글 제목
    title: {
      type: String,
      maxlength: 100,
    },
    // 글 내용
    content: {
      type: String,
      minlength: 5,
    },
    // 첨부파일 url
    fileUrl: {
      type: Array,
    },
    // 작성 시간
    createAt: {
      type: Date,
      default: Date.now,
    },
    // 조회수
    views: {
      type: Number,
      default: 0,
    },
    // 사용하는 기술 스택
    techStack: {
      type: Array,
      default: [],
    },
    //지역
    location: String,
    // 모집인원
    recruitment: {
      type: Number,
      default: 1,
    },
    // 모집 분야(스터디 or 프로젝트 or 자유 or Q&A)
    field: String,
    // 모집이 진행중인지 아닌지
    isOngoing: {
      type: Boolean,
      default: true,
    },
    // 포럼글에서 쓰이는 tag를 저장하기 위해
    tag: {
      type: Array,
      default: [],
    },
    // 해당 게시글의 댓글 정보(스터디, 프로젝트, 포럼 모두 필요)
    comments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],

    // 해당 게시글의 좋아요 정보(포럼만 필요)
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Like",
      },
    ],
    // 해당 게시글의 스크랩 정보(포럼만 필요)
    scraps: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Scrap",
      },
    ],
    fileName: {
      type: Array,
    },
  },
  { timestamps: true }
);

postSchema.plugin(deepPopulate);

const Post = mongoose.model("Post", postSchema);
export default Post;
