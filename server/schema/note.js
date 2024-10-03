import mongoose from "mongoose";

const notesschema = new mongoose.Schema({
  heading: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export const note = mongoose.model("note", notesschema);
