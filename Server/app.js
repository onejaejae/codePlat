import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";

import routes from "./routes";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import postRouter from "./routers/postRouter";
import commentRouter from "./routers/commentRouter";
import scrapRouter from "./routers/scrapRouter";
import likeRouter from "./routers/likeRouter";
import "./passport";

const app = express();
const CookieStore = mongoStore(session);

const corsOption = {
  origin: "http://localhost:3000", // 허락하는 요청 주소
  credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(cors(corsOption));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/resister", (req, res) => {
  console.log("req.user", req.user);
  const html = `
  <form action=/api${routes.join} method="post" >
    <p><input type="email" name="email" placeholder="이메일" /></p>  
    <p><input type="password" name="password" placeholder="비밀번호" /></p>        
    <p><input type="text" name="nickname" placeholder="닉네임" /></p>   
    <button>Send my greetings</button>
  </form>
  `;

  res.send(html);
});

app.get("/local/resister", (req, res) => {
  console.log("req.user", req.user);
  const html = `
  <form action=/api${routes.login} method="post" >
    <p><input type="email" name="email" placeholder="이메일" /></p>  
    <p><input type="password" name="password" placeholder="비밀번호" /></p>        
    <button>Send my greetings</button>
  </form>
  `;

  res.send(html);
});

app.get("/write", (req, res) => {
  console.log("req.user", req.user);
  const html = `
  <form action= "/api/posts" method="post" >
    <p><input type="text" name="writer" placeholder="writer"  value= "602cca27a75b7e495490c3c1"/></p>  
    <p><input type="text" name="type" placeholder="type"  value="study"/></p>
    <p><input type="text" name="title" placeholder="title"  value="리엑트 스터디 구해요"/></p>      
    <p><input type="text" name="content" placeholder="content"  value="같이 공부할 사람"/></p>
    <p><input type="text" name="techStack" placeholder="techStack"  value="JS"/></p>      
    <p><input type="text" name="location" placeholder="location"  value="수원"/></p>      
    <p><input type="number" name="recruitment" placeholder="recruitment"  value="1"/></p>
    <p><input type="text" name="field" placeholder="field" value="스터디" /></p>                          
    <button>Send my greetings</button>
  </form>
  `;

  res.send(html);
});

app.get("/local/login", (req, res) => {
  const html = `
  <form action=/api${routes.joinOption} method="post" enctype="multipart/form-data">
    <div>
      <label for="avatar" > Avatar </label>
      <p><input type="file" id="avatar" name="avatar" accept="image/*" /></p>
    </div>
    <p><input type="text" name="nickname" placeholder="닉네임"  value="원제"/></p>        
    <p><input type="email" name="github" placeholder="github 계정"  value = "asd@asd"/></p>
    <p><input type="text" name="techStack" placeholder="기술스택"  value = "react"/></p>
    <p><input type="text" name="id" placeholder="유저 id" value=${req.query.id} /></p>
    <p><input type="text" name="type" placeholder="type" value=${req.query.type} /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.get("/editProfile", (req, res) => {
  const html = `
  <form action=/api/user${routes.editProfile} method="post">
    <p><input type="text" name="nickname" placeholder="닉네임"  value="원제"/></p>        
    <p><input type="text" name="githubUrl" placeholder="깃허브" value="yoteamo7@naver.com" /></p>
    <p><input type="text" name="techStack" placeholder="기술스택" value="JS" /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.get("/changePassword", (req, res) => {
  const html = `
  <form action=/api/user${routes.changePassword} method="post">
    <p><input type="text" name="password" placeholder="새로운 비밀번호" value="12345" /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.get("/writeComment", (req, res) => {
  const html = `
  <form action= "/api/comment/write" method="post">
    <p><input type="text" name="content" placeholder="댓글 내용" value="긍정!" /></p>
    <p><input type="text" name="type" placeholder="카테고리" value="study" /></p>
    <p><input type="text" name="postId" placeholder="포스트 아이디" value="60190da857073d08a41c216f" /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.get("/scrap", (req, res) => {
  const html = `
  <form action= "/api/scrap/600a6e021be33857940c5ae7/upScrap" method="post">
    <p><input type="text" name="type" placeholder="type" value="forum" /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.get("/like", (req, res) => {
  const html = `
  <form action= "/api/like/600a6f5f1337e23ab8aeaedf/upLike" method="post">
    <p><input type="text" name="type" placeholder="type" value="post" /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.get("/editComment", (req, res) => {
  const html = `
  <form action= "/api/comment/6007a6d62334bc26486a1c4e/edit" method="post">
    <p><input type="text" name="content" placeholder="수정 댓글 내용" value="화이링" /></p>
    <p><input type="submit" value="Join Now" /></p>
  </form>
  `;

  res.send(html);
});

app.use(routes.user, userRouter);
app.use(routes.posts, postRouter);
app.use(routes.comments, commentRouter);
app.use(routes.scrap, scrapRouter);
app.use(routes.like, likeRouter);
app.use(routes.home, globalRouter);

export default app;
