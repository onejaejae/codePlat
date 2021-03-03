import express from "express";
import {
  postComment,
  updateComment,
  deleteComment,
  updateParentComment,
} from "../controllers/commentController";
import routes from "../routes";

const commentRouter = express.Router();

commentRouter.post("/", postComment);
commentRouter.patch("/", updateComment);

// root 댓글 삭제시 자식 댓글이 있는 경우
commentRouter.put(routes.commentParentDelete, updateParentComment);

// root 댓글 삭제시 자식 댓글이 없는 경우
commentRouter.delete(routes.commentDelete, deleteComment);

export default commentRouter;
