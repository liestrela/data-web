import { Router } from "express";
import { authToken } from "@/middlewares/auth.middleware";
import { create, get, update, remove } from "@/controllers/card.controller";

const cardRouter = Router();

cardRouter.use(authToken);

cardRouter.post("/create", create);
cardRouter.post("/get", get);
cardRouter.post("/update", update);
cardRouter.post("/delete", remove);

export default cardRouter;
