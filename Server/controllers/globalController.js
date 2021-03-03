import passport from "passport";
import url from "url";
import crypto from "crypto";
import User from "../models/User";
import routes from "../routes";
import { nodemail } from "../common/nodemailer";
import { jsonParse } from "../common/jsonParse";
import { generateHash } from "../common/generateHash";
import { CLIENT_URL } from "../common/config";

export const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("err", err);
      return next(err);
    }
    if (info) {
      console.log("info", info);
      return res.status(400).send(info.message);
    }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        console.log("loginErr", loginErr);
        return next(loginErr);
      }
      return res.status(200).json({
        suceess: true,
        user: req.user,
      });
    });
  })(req, res, next);
};

export const postJoin = async (req, res) => {
  const {
    body: { password, email, nickname },
  } = req;

  const hash = await generateHash(password);

  try {
    const user = await User({
      email,
      nickname,
      password: hash,
    });

    await User.register(user, password);

    return res.status(201).json({
      suceess: true,
      userId: user.id,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      suceess: false,
      error,
    });
  }
};

export const confirmEmail = async (req, res) => {
  const key = decodeURIComponent(req.query.key);

  try {
    await User.findOneAndUpdate(
      { key_for_verify: key },
      { email_verified: true },
      { new: true }
    );

    return res.send(
      '<script type="text/javascript">alert("이메일 인증을 완료했습니다."); window.location="http://codeplat.co.kr/auth/login"; </script>'
    );
  } catch (error) {
    return res.status(200).json({
      suscess: false,
      error,
    });
  }
};

export const postJoinOption = async (req, res) => {
  const {
    body: { type, email, nickname },
    files,
  } = req;

  const Email = await User.findOne({ email });
  const Nickname = await User.findOne({ nickname });

  if (Email) {
    return res.status(200).json({
      message: "email is reduplication",
    });
  }

  if (Nickname) {
    return res.status(200).json({
      message: "nickname is reduplication",
    });
  }

  const keyOne = crypto.randomBytes(256).toString("hex").substr(100, 5);
  const keyTwo = crypto.randomBytes(256).toString("base64").substr(50, 5);
  const keyForVerify = keyOne + keyTwo;

  // sns 로그인일 경우
  if (type === "sns") {
    const update = req.body;

    if (req.body.techStack) {
      const curr = jsonParse(req.body.techStack);
      update.techStack = curr;
    }

    if (files.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      const length = files.length;
      update.avatarUrl = files[length - 1].path;
    }

    try {
      const user = await User.findOneAndUpdate({ _id: req.user.id }, update, {
        new: true,
      });

      return res.status(200).json({
        suceess: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        suceess: false,
        error,
      });
    }
  } else if (type === "email") {
    const update = req.body;

    if (req.body.techStack) {
      const curr = jsonParse(req.body.techStack);
      update.techStack = curr;
    }

    update.key_for_verify = keyForVerify;
    console.log("files", files);
    if (files.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      const length = files.length;
      update.avatarUrl = files[length - 1].location;
    }

    try {
      const user = await User.findOneAndUpdate({ _id: req.user.id }, update, {
        new: true,
      });

      nodemail(user.email, keyForVerify);

      // redirect 이메일을 확인하세요 url로 보내주기
      return res
        .status(200)
        .send(
          '<script type="text/javascript">alert("이메일을 확인하세요."); </script>'
        );
    } catch (error) {
      return res.status(400).json({
        suceess: false,
        error,
      });
    }
  }
  // local 로그인일 경우
  else {
    const {
      body: { id },
    } = req;

    const update = req.body;

    if (req.body.techStack) {
      const curr = jsonParse(req.body.techStack);
      update.techStack = curr;
    }

    console.log("files", files);

    if (files.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      const length = files.length;
      update.avatarUrl = files[length - 1].location;
    }
    update.key_for_verify = keyForVerify;

    try {
      const user = await User.findOneAndUpdate({ _id: id }, update, {
        new: true,
      });

      nodemail(user.email, keyForVerify);
      // redirect 이메일을 확인하세요 url로 보내주기
      return res.send(
        '<script type="text/javascript">alert("이메일을 확인하세요."); </script>'
      );
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({
        suceess: false,
        error,
      });
    }
  }
};

export const logout = async (req, res) => {
  req.logout();
  return res.status(200).json({
    suceess: true,
  });
};

export const setUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      suceess: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// github

export const githubLogin = passport.authenticate("github", {
  prompt: "select_account",
});

export const postGithubLogin = (req, res) => {
  if (req.user.email === String(req.user.githubId)) {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}/auth/register`,
        query: {
          type: "email",
        },
      })
    );
  } else if (!req.user.nickname) {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}/auth/register`,
        query: {
          type: "sns",
        },
      })
    );
  } else {
    res.redirect(`${CLIENT_URL}`);
  }
};

export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, email },
  } = profile;

  try {
    let newUser;

    // email 정보가 없는 유저를 찾기 위해
    const user = await User.findOne({ githubId: id });

    const user2 = await User.findOne({ email });

    //
    if (user) {
      user.githubId = id;
      await user.save();
      return cb(null, user);
    }
    // 같은 이메일인 경우
    else if (user2) {
      user2.githubId = id;
      await user2.save();
      return cb(null, user2);
    } else {
      if (email) {
        newUser = await User.create({
          githubId: id,
          email,
          email_verified: true,
        });
      } else {
        newUser = await User.create({
          githubId: id,
          email: id,
          email_verified: false,
        });
      }

      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};

// kakao

export const kakaoLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const {
    _json: { id },
    _json: {
      kakao_account: { email },
    },
  } = profile;

  try {
    const user = await User.findOne({ kakaoId: id });
    const user2 = await User.findOne({ email });
    let newUser;

    if (user) {
      user.kakaoId = id;
      await user.save();
      return done(null, user);
    } else if (user2) {
      user2.kakaoId = id;
      await user2.save();
      return done(null, user);
    } else {
      if (email) {
        newUser = await User.create({
          kakaoId: id,
          email,
          email_verified: true,
        });
      } else {
        newUser = await User.create({
          kakaoId: id,
          email: id,
          email_verified: false,
        });
      }
      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
};

export const KakaoLogin = (req, res) => {
  res.redirect(
    `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=http://codeplat.co.kr${routes.home}${routes.kakaoCallback}&prompt=login`
  );
};

export const postKakaoLogin = (req, res) => {
  if (req.user.email === String(req.user.kakaoId)) {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}/auth/register`,
        query: {
          type: "email",
        },
      })
    );
  } else if (!req.user.nickname) {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}/auth/register`,
        query: {
          type: "sns",
        },
      })
    );
  } else {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}`,
      })
    );
  }
};

// google

export const googleLoginCallback = async (
  request,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const { id, email } = profile;

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.googleId = id;
      await user.save();
      return done(null, user);
    } else {
      const newUser = await User.create({
        googleId: id,
        email,
        email_verified: true,
      });

      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
};

export const googleLogin = passport.authenticate("google", {
  scope: ["email", "profile"],
  prompt: "select_account",
});

export const postGoogleLogin = (req, res) => {
  if (!req.user.nickname) {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}/auth/register`,
        query: {
          type: "sns",
        },
      })
    );
  } else {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}`,
      })
    );
  }
};

// naver

export const naverLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const {
    id,
    _json: { email },
  } = profile;

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.naverId = id;
      await user.save();
      return done(null, user);
    } else {
      const newUser = await User.create({
        naverId: id,
        email,
        email_verified: true,
      });

      return done(null, newUser);
    }
  } catch (error) {
    console.log("error", error);
    return done(error);
  }
};

export const naverLogin = passport.authenticate("naver", {
  failureRedirect: `${CLIENT_URL}`,
});

export const postNaverLogin = async (req, res) => {
  if (!req.user.nickname) {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}/auth/register`,
        query: {
          type: "sns",
        },
      })
    );
  } else {
    return res.redirect(
      url.format({
        pathname: `${CLIENT_URL}`,
      })
    );
  }
};

export const postForgotPassword = async (req, res) => {
  const {
    body: { email },
  } = req;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "유저 정보가 없습니다",
      });
    }

    nodemail(user.email, "", "password");

    return res.status(200).json({
      message: "유저 정보가 있습니다",
    });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

export const postChangePassword = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  try {
    const hash = await generateHash(password);

    await User.findOneAndUpdate({ email }, { password: hash });
    res.status(200).json({
      suceess: true,
    });
  } catch (error) {
    res.status(400).json({
      suceess: false,
      error,
    });
  }
};

export const postMailAuth = async (req, res) => {
  const {
    body: { email },
  } = req;

  if (!email) {
    res.status(400).end();
  }

  const keyOne = crypto.randomBytes(256).toString("hex").substr(100, 5);
  const keyTwo = crypto.randomBytes(256).toString("base64").substr(50, 5);
  const keyForVerify = keyOne + keyTwo;

  try {
    const user = await User.findOne({ email });
    user.key_for_verify = keyForVerify;
    await user.save();

    nodemail(email, keyForVerify);
    res.status(200).json({
      suceess: true,
    });
  } catch (error) {
    res.status(400).json({
      suceess: false,
    });
  }
};
