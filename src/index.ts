import express from "express";
import { AuthRouter } from "./routes";
import { connectDB } from "./utils";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/api/health", (_, res) => {
  res.send("ok");
});

app.use("/api/auth", AuthRouter);

const port = process.env.PORT || 8080;
connectDB(process.env.MONGO_URI!).then(() => {
  app.listen(port, () => {
    console.log("listening for requests on", port);
  });
});
