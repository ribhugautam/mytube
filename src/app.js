import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//using cors for cross origin resource sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//Handles json data in req.body
app.use(
  express.json({
    limit: "16kb",
  })
);

//Handles form data in req.body
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

//Handles static files
app.use(express.static("public"));

//Handles cookies
app.use(cookieParser());

//routes imports
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscribeRouter from './routes/subscribe.routes.js' 
import playListRouter from './routes/playlist.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/subscriptions", subscribeRouter)
app.use("/api/v1/playlists", playListRouter)

export { app };
