const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    content: { type: String },
    author: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Comment", commentSchema);
