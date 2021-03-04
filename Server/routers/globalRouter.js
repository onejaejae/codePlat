import express from "express";
import passport from "passport";
import {
  postLogin,
  postJoin,
  logout,
  githubLogin,
  postGithubLogin,
  postKakaoLogin,
  KakaoLogin,
  googleLogin,
  postGoogleLogin,
  naverLogin,
  postNaverLogin,
  postJoinOption,
  confirmEmail,
  setUser,
  postForgotPassword,
  postChangePassword,
  postMailAuth,
} from "../controllers/globalController";

import { multerAvatar } from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();

//join
globalRouter.get(routes.setUser, setUser);
globalRouter.get(routes.confirmEmail, confirmEmail);

globalRouter.post(routes.join, postJoin);
globalRouter.post(
  routes.joinOption,
  multerAvatar.any("avatar"),
  postJoinOption
);

// login
globalRouter.post(routes.login, postLogin);

// logout
globalRouter.get(routes.logout, logout);

// github
globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", {
    failureRedirect: "https://codeplat.co.kr/auth/register",
  }),
  postGithubLogin
);

// kakao
globalRouter.get(routes.kakao, KakaoLogin);
globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", {
    failureRedirect: "https://codeplat.co.kr/auth/register",
  }),
  postKakaoLogin
);

// google

globalRouter.get(routes.google, googleLogin);
globalRouter.get(
  routes.googleCallback,
  passport.authenticate("google", {
    failureRedirect: "https://codeplat.co.kr/auth/register",
  }),
  postGoogleLogin
);

// naver

globalRouter.get(routes.naver, naverLogin);
globalRouter.get(
  routes.naverCallback,
  passport.authenticate("naver", {
    failureRedirect: "https://codeplat.co.kr/auth/register",
  }),
  postNaverLogin
);

// 비밀번호 찾기
globalRouter.post(routes.forgotPassword, postForgotPassword);
globalRouter.patch(routes.changePassword, postChangePassword);
// 메일인증
globalRouter.post(routes.mailAuth, postMailAuth);

export default globalRouter;
