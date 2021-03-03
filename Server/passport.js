import GitHubStrategy from "passport-github";
import GoogleStrategy from "passport-google-oauth2";
import NaverStrategy from "passport-naver";
import bcrypt from "bcrypt";
import { BACK_URL } from "./common/config";

import {
  githubLoginCallback,
  kakaoLoginCallback,
  googleLoginCallback,
  naverLoginCallback,
} from "./controllers/globalController";
import User from "./models/User";
import routes from "./routes";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username });

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        // eslint-disable-next-line consistent-return
        bcrypt.compare(password, user.password, (err, isMatch) => {
          console.log(
            "password",
            password,
            "user password",
            user.password,
            isMatch
          );

          if (err) {
            console.log("err", err);
            return done(null, false);
          }
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }

          // 비밀번호가 일치하고 이메일 인증을 마친 유저만
          if (user.email_verified) {
            return done(null, user);
          } else {
            return done(null, false, { message: "이메일 인증을 해주세요" });
          }
        });
      } catch (error) {
        console.log("error", error);
        return done(error);
      }
    }
  )
);

// github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${
        process.env.NODE_ENV === "production" ? BACK_URL : "localhost://4000"
      }${routes.home}${routes.githubCallback}`,
      scope: "user:email",
      authorizationURL: `https://github.com/login/oauth/authorize?client_id=${
        process.env.GITHUB_CLIENT_ID
      }&redirect_uri=${
        process.env.NODE_ENV === "production" ? BACK_URL : "localhost://4000"
      }${routes.home}${routes.githubCallback}&login=select_account`,
    },
    githubLoginCallback
  )
);

// kakao
const KakaoStrategy = require("passport-kakao").Strategy;

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${
        process.env.NODE_ENV === "production" ? BACK_URL : "localhost://4000"
      }${routes.home}${routes.kakaoCallback}`,
      authorizationURL: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
        process.env.KAKAO_CLIENT_ID
      }&redirect_uri=${
        process.env.NODE_ENV === "production" ? BACK_URL : "localhost://4000"
      }${routes.home}${routes.kakaoCallback}&prompt=login`,
    },
    kakaoLoginCallback
  )
);

// google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${
        process.env.NODE_ENV === "production" ? BACK_URL : "localhost://4000"
      }${routes.home}${routes.googleCallback}`,
    },
    googleLoginCallback
  )
);

// naver
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: `${
        process.env.NODE_ENV === "production" ? BACK_URL : BACK_URL
      }${routes.home}${routes.naverCallback}`,
      authType: "reauthenticate",
    },
    naverLoginCallback
  )
);

passport.serializeUser((user, done) => {
  // req.login()에서 넘겨준 user값
  done(null, user.email); // user에서 email만 세션에 저장
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ email: id });
  done(null, user);
});
