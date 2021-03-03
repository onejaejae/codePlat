import express from "express";
import { multerFile } from "../middlewares";
import routes from "../routes";

import {
  postWrite,
  getPosts,
  getPostDetail,
  deletePost,
  updatePost,
  getForum,
  getPost,
} from "../controllers/postController";

const postRouter = express.Router();

// 랜딩페이지에서 get 요청
postRouter.get("/", getPost);
postRouter.post("/", multerFile.array("files", 4), postWrite);
postRouter.patch("/", multerFile.array("files", 4), updatePost);

// 정렬, 검색 추가한 get 요청
postRouter.get(routes.post, getPosts);

postRouter.get(routes.getForum, getForum);
postRouter.get(routes.postId, getPostDetail);

postRouter.delete(routes.postId, deletePost);

export default postRouter;
