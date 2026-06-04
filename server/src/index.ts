import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import cardRouter from "./routes/card.routes";
import uploadRouter from "./routes/upload.routes";
import { initStorage } from "./util/storage";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/card", cardRouter);
app.use("/api/upload", uploadRouter);

app.listen(port, async () => {
  console.log(`dog ${port}`);
  await initStorage();
});
