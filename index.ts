import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { json } from "stream/consumers";

dotenv.config();

const app = express();

app.use(cors());

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "content from server" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
