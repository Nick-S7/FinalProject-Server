const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    // unless you are defining more than the "type" property, you don't have to use {} (see below)
    // firstName: {type: String, require: true}
    name: String,
    location: String,
    price: Number,
    date: { type: String },
    image: { type: String },
    imageArray: { type: [String] },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    id: String,
    creator: { type: String },
  },
  {
    // keeps record when is created and updated
    timestamps: true,
  }
);

// const Event = model('Event', eventSchema);
// module.exports = Event;

module.exports = model("Event", eventSchema);
