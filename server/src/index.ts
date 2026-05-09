import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message:"Ok" });
});

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`dog ${port}`);
});