import express from "express";
import routes from "../routes";
import { upLike, unLike } from "../controllers/likeController";

const likeRouter = express.Router();

//upLike
likeRouter.post("/", upLike);

//unLike
likeRouter.delete(routes.unLike, unLike);

export default likeRouter;
