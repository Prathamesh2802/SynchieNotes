import { Router } from "express";

import {
  homepage,
  createNote,
  NotesCreated,
  NoteView,
  NoteEdit,
  EditedNote,
  DeleteNote,
  About,
} from "../controller/controllerDashboard.js";

import {
  login,
  PostRegistration,
  register,
  isLogging,
  Profile,
  isloggingout,
} from "../controller/controllerauth.js";

import passport from "passport";

import { Redis } from "ioredis";

import dotenv from "dotenv";

dotenv.config();

const route = Router();

route.get("/", homepage);

route.get("/NewNote", createNote);

route.get("/login", login);

route.get("/Register", register);

route.post("/Registering", PostRegistration);

// ? Old method without using Redis
// route.post("/login", passport.authenticate("local"), isLogging);

// ? New Method

const redis = new Redis({
  host: process.env.REDISHOST,
  port: process.env.REDISPORT,
  password: process.env.REDISPASSWORD,
});

const ATTEMPT_LIMIT = 30; // Maximum number of failed attempts
const LOCKOUT_KEY_PREFIX = "login_attempts"; // Redis key prefix

// Helper function to get Redis key for a user's email
const getRedisKey = (email) => `${LOCKOUT_KEY_PREFIX}:${email}`;

// Middleware to check login attempts and enforce lockout
const rateLimitLogin = async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const currentTime = Date.now();

  // Get the user's attempt data from Redis
  const key = getRedisKey(email);
  const attemptData = await redis.hgetall(key);

  let count = parseInt(attemptData.count || "0", 10);
  let lockUntil = parseInt(attemptData.lockUntil || "0", 10);

  // Check if the user is currently locked out
  if (lockUntil && currentTime < lockUntil) {
    const lockTimeLeft = Math.ceil((lockUntil - currentTime) / 1000); // Time left in seconds
    return res.status(429).json({
      message: `Too many login attempts. You are locked out. Try again in ${lockTimeLeft} seconds.`,
    });
  }

  next(); // Proceed to passport authentication if not locked
};

// Passport login route with rate limiting and error handling
route.post("/login", rateLimitLogin, (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    const email = req.body.email;

    if (err) {
      return next(err); // Handle any internal errors
    }

    if (!user) {
      // Use the message from info
      const currentTime = Date.now();
      const key = getRedisKey(email);

      // Fetch the current attempt data
      const attemptData = await redis.hgetall(key);
      let count = parseInt(attemptData.count || "0", 10);
      count += 1;

      let lockUntil = 0;
      if (count >= 5 && count < 10) {
        lockUntil = currentTime + 5 * 60 * 1000; // Lock for 5 minutes
      } else if (count >= 10 && count < ATTEMPT_LIMIT) {
        lockUntil = currentTime + 10 * 60 * 1000; // Lock for 10 minutes
      } else if (count >= ATTEMPT_LIMIT) {
        lockUntil = currentTime + 24 * 60 * 60 * 1000; // Lock for 24 hours
      }

      // Store updated attempt data in Redis
      await redis.hset(key, "count", count, "lockUntil", lockUntil);

      // Send response for invalid credentials
      return res.status(401).json({
        message: info.message || "Invalid credentials. Please try again.",
        attemptsLeft: ATTEMPT_LIMIT - count,
      });
    }

    // If successful, reset Redis attempts
    await redis.del(getRedisKey(email));

    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle login error
      }
      return res.status(200).json({ success: "Login successful" });
    });
  })(req, res, next);
});

route.post("/NotesAdd", NotesCreated);

route.get("/note/viewNote/:id", NoteView);
route.get("/note/edit/:id", NoteEdit);
route.post("/note/edit/:id", EditedNote);
route.get("/note/delete/:id", DeleteNote);

route.get("/profile", Profile);

route.get("/about", About);

route.get("/logout", isloggingout);

export default route;
