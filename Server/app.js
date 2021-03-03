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
import path from "path";

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
app.use(express.static(path.join(__dirname, "../Frontend/.next")));
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

app.use(routes.user, userRouter);
app.use(routes.posts, postRouter);
app.use(routes.comments, commentRouter);
app.use(routes.scrap, scrapRouter);
app.use(routes.like, likeRouter);
app.use(routes.home, globalRouter);

export default app;
