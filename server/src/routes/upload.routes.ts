import { Router } from "express";
import multer from "multer";
import { authToken } from "@/middlewares/auth.middleware";
import { storeUpload, removeUpload } from "@/controllers/upload.controller";

const uploadRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.use(authToken);

uploadRouter.post("/store", upload.array("files"), storeUpload);
uploadRouter.post("/delete", removeUpload);

export default uploadRouter;