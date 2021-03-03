import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const deepPopulate = require("mongoose-deep-populate")(mongoose);

const userSchema = new mongoose.Schema(
  {
    // 닉네임
    nickname: {
      type: String,
      unique: 1,
      sparse: true,
    },
    // 이메일
    email: {
      type: String,
      unique: 1,
    },
    // 선택한 기술 스택
    techStack: {
      type: Array,
      default: [],
    },
    secretGithub: {
      type: Boolean,
      default: false,
    },
    // 선택사항 깃허브 url
    githubUrl: String,
    // 선택사항 아바타 url
    avatarUrl: String,
    // passport google id
    googleId: Number,
    // passport naver id
    naverId: Number,
    // passport githubId id
    githubId: Number,
    // passport kakaoId id
    kakaoId: Number,
    // 유저가 올린 글
    post: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
      },
    ],
    // 유저가 쓴 댓글
    comments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
    // 유저가 좋아요 누른 것
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Like",
      },
    ],
    // 유저가 스크랩 한 것
    scraps: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Scrap",
      },
    ],
    //인증여부(유저가 이메일 인증을 완료하면 true로 바꾼다)
    email_verified: {
      type: Boolean,
      default: false,
    },
    //인증코드(쿼리스트링으로 이메일 인증 url의 인증코드를 줘서 db에 저장된 인증코드가 있으면 이메일 인증을 true로 변경)
    key_for_verify: {
      type: String,
    },
    password: {
      type: String,
    },

    // 일반유저 1
    // 관리자 0
    role: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(deepPopulate);

const User = mongoose.model("User", userSchema);
export default User;
