const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    // unless you are defining more than the "type" property, you don't have to use {} (see below)
    // firstName: {type: String, require: true}
    name: String,
    location: String,
    price: Number,
    date: Date,
    image: { type: String },
    imageArray: { type: [String] },
    comments: { type: Schema.Types.ObjectId, ref: "Comment", default: [] },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    // keeps record when is created and updated
    timestamps: true,
  }
);

// const Event = model('Event', eventSchema);
// module.exports = Event;

module.exports = model("Event", eventSchema);
