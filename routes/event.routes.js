// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE, THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require("express");
const eventRouter = express.Router();
const uploadCloud = require("../configs/cloudinary-setup");

// ********* require Event model in order to use it for CRUD *********
const Event = require("../models/Event.model");

// ****************************************************************************************
// POST route to create a new event in the DB
// ****************************************************************************************

// <form action="/event" method="POST">
eventRouter.post(
  "/api/events/create",
  uploadCloud.single("image"),
  (req, res, next) => {
    console.log({ file: req.file });
    console.log("is user logged into backend?", req.user);
    const eventInfo = req.body;
    eventInfo.creator = req.user._id;
    eventInfo.image = req.file.path;
    console.log(eventInfo);
    Event.create(eventInfo)
      .then((createdEvent) => res.status(200).json({ event: createdEvent }))
      .catch((err) =>
        res
          .status(400)
          .json({ message: "an error ocurred creating event: ", err })
      );
  }
);

// ****************************************************************************************
// GET all events from the DB
// ****************************************************************************************

eventRouter.get("/api/events", (req, res, next) => {
  Event.find() // <-- .find() method gives us always an ARRAY back
    .then((eventsFromDB) => res.status(200).json({ events: eventsFromDB }))
    .catch((err) => next(err));
});

//GET Event Details

eventRouter.get("/api/events/:id", (req, res, next) => {
  // console.log(req.params.id);
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((eventFromDB) => {
      //if this event is not listed, create the event in the DB.
      if (eventFromDB === null) {
        console.log("This event is not in the DB", eventId);
        Event.create({ _id: eventId })
          //after creating the event, change the MongoDB id to the id from the API. This will support logic to distinguish between user-created events with the MongoDB id of 20 characters, and the API events with an API id 14 characters.
          .then((newEventFromDb) => {
            newEventFromDb._id = eventId;
            console.log(newEventFromDb._id);
          })
          .catch((err) =>
            res
              .status(400)
              .json({ message: "error updating event ID in DB:", err })
          );
      }
      res.status(200).json({ event: eventFromDB });
      console.log({ eventFromDb });
    })
    .catch((err) => res.status(400).json({ message: err }));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************

// <form action="/events/{{foundEvent._id}}/update" method="POST">
eventRouter.post("/api/events/:id/update", (req, res) => {
  Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedEvent) => res.status(200).json({ event: updatedEvent }))
    .catch((err) => res.status(400).json({ message: err }));
});

// ****************************************************************************************
// POST route to delete the event
// ****************************************************************************************

// <form action="/event/{{this._id}}/delete" method="post">
eventRouter.post("/api/events/:eventId/delete", (req, res) => {
  Event.findByIdAndRemove(req.params.eventId)
    .then(() => res.json({ message: "Successfully removed!" }))
    .catch((err) => res.status(400).json({ message: err }));
});

module.exports = eventRouter;
