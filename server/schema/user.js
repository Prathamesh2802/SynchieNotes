import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  fullname: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export const user = mongoose.model("user", userschema);
