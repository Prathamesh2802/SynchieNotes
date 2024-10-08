import express, { urlencoded } from "express";

import dotenv from "dotenv";

import expressEjsLayouts from "express-ejs-layouts";

import route from "../server/routes/index.js";

import mongoose from "mongoose";

import session from "express-session";

import mongoSanitize from 'express-mongo-sanitize';

// * Importing Passport for real auth
import passport from "passport";

// * Importing strategies

import "../server/strategies/local_strategies.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 7070;

app.use(urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static("public"));

app.use(expressEjsLayouts);
app.set("layout", "./layout/main");
app.set("view engine", "ejs");

// * DB Connection

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.error("Error Connecting to DB: ", err);
  });

  // Data sanitization against NoSQL query injection
app.use(mongoSanitize());



// * Session Use

app.use(
  session({
    secret: process.env.SESSIONSECRETKEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
// * using Passport Js
app.use(passport.initialize());
app.use(passport.session());

// * Routes

app.use("/", route);

// * Invalid Link access error

app.get("*", (req, res) => {
  res.status(404).send("Invalid Link");
});

app.listen(port, () => {
  console.log(`Listening on the Port ${port} `);
});
