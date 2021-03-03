import express from "express";
import routes from "../routes";
import { postUpScrap, postUnScrap } from "../controllers/scrapController";

const scrapRouter = express.Router();

//upScrap
scrapRouter.post("/", postUpScrap);
//unScrap
scrapRouter.delete(routes.unScrap, postUnScrap);

export default scrapRouter;
