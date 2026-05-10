import { Router } from "express";
import { authToken } from "@/middlewares/auth.middleware";

const postitRouter = Router();

postitRouter.use(authToken);

export default postitRouter;