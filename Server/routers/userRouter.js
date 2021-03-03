import express from "express";
import routes from "../routes";
import {
  getUserDetail,
  postEditProfile,
  postChangePassword,
  getUserActivity,
  getProfile,
  deleteSecession,
} from "../controllers/userControllers";
import { multerAvatar } from "../middlewares";

const userRouter = express.Router();

// 마이페이지 프로필
userRouter.get("/", getProfile);
userRouter.patch("/", multerAvatar.any("avatar"), postEditProfile);

// 마이페이지 내활동
userRouter.get(routes.userActivity, getUserActivity);
userRouter.get(routes.userDetail, getUserDetail);

userRouter.patch(routes.changePassword, postChangePassword);

// 회원 탈퇴
userRouter.delete(routes.secession, deleteSecession);

export default userRouter;
