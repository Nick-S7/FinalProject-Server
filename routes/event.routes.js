// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE, THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require("express");
const eventRouter = express.Router();

// ********* require Event model in order to use it for CRUD *********
const Event = require("../models/Event.model");

// ****************************************************************************************
// POST route to create a new event in the DB
// ****************************************************************************************

// <form action="/event" method="POST">
eventRouter.post("/api/events", (req, res, next) => {
  Event.create(req.body)
    .then((createdEvent) => res.status(200).json({ event: createdEvent }))
    .catch((err) => next(err));
});

// ****************************************************************************************
// GET all events from the DB
// ****************************************************************************************

eventRouter.get("/api/events", (req, res, next) => {
  Event.find() // <-- .find() method gives us always an ARRAY back
    .then((eventsFromDB) => res.status(200).json({ events: eventsFromDB }))
    .catch((err) => next(err));
});

// ****************************************************************************************
// POST route to save the updates
// ****************************************************************************************

// <form action="/events/{{foundEvent._id}}/update" method="POST">
eventRouter.post("/api/events/:id/update", (req, res) => {
  Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedEvent) => res.status(200).json({ event: updatedEvent }))
    .catch((err) => next(err));
});

// ****************************************************************************************
// POST route to delete the event
// ****************************************************************************************

// <form action="/event/{{this._id}}/delete" method="post">
eventRouter.post("/api/events/:eventId/delete", (req, res) => {
  Event.findByIdAndRemove(req.params.eventId)
    .then(() => res.json({ message: "Successfully removed!" }))
    .catch((err) => next(err));
});

module.exports = eventRouter;
