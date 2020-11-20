const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: { type: String },
    author: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Comment", commentSchema);
