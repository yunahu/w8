import "dotenv/config.js";

import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import { connectToMongo } from "./services/mongo.js";
import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "./services/redis.js";
import passport from "passport";

// Constants
const port = process.env.PORT || 3000;

// Create http server
const app = express();

// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join("public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new RedisStore({ client: redisClient }),
  })
);

app.use(passport.authenticate("session"));

app.use("/", indexRouter);
app.use("/", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Start http server
connectToMongo().then(async () => {
  await redisClient.connect();

  app.listen(port, async () => {
    console.log(`Server started at http://localhost:${port}`);
  });
});
