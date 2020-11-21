// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE,
// THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require("express");
const router = express.Router();

// ********* require Event and Comment models in order to use them *********
const Event = require("../models/Event.model");
const Comment = require("../models/Comment.model");

// ****************************************************************************************
// POST - create a comment
// ****************************************************************************************

// event route - to save to database a new comment on a specific event
router.post("/api/events/:eventId/comment", (req, res, next) => {
  const eId = req.params.eventId;
  const { content } = req.body;

  // 1. find an event based on the id from the url
  Event.findById(eId)
    .then((eventFromDb) => {
      console.log(req.user);
      // console.log(eventId);
      // Check if the event is already in our Db, if not, we need to create it
      if (eventFromDb === null) {
        console.log("No event with this ID", eId);
        console.log(req.params);
        //Create a record of the event with the id in the Db
        Event.create({
          eId,
        })
          .then((newEventFromDb) => {
            Comment.create({
              content,
              author: req.user.username,
            })
              .then((newCommentFromDb) => {
                // Update the event with new comments to the database
                console.log(req.user);
                Event.findByIdAndUpdate(
                  newEventFromDb.eventId,
                  {
                    $push: {
                      comments: newCommentFromDb._id,
                    },
                  },
                  { new: true }
                ).then((updatedEvent) =>
                  res.status(200).json({ event: updatedEvent })
                );
              })
              .catch((err) =>
                console.log(`Err while saving a comment in an event: ${err}`)
              )
              .catch((err) =>
                console.log(`Err while creating a comment in an event: ${err}`)
              );
          })
          .catch((err) =>
            console.log(`Err while creating a new event: ${err}`)
          );
      } else {
        console.log("got here");
        Comment.create({
          content,
          author: req.user.username,
        })
          .then((newCommentFromDb) => {
            // Update the event with new comments to the database
            console.log({ newCommentFromDb });
            Event.findByIdAndUpdate(eventFromDb._id, {
              $push: {
                comments: newCommentFromDb._id,
              },
            }).then((updatedEvent) =>
              res
                .status(200)
                .json({ event: updatedEvent })
                .catch((err) =>
                  console.log(`Err while saving a comment in a event: ${err}`)
                )
            );
          })
          .catch((err) =>
            console.log(`Err while creating a comment on a event: ${err}`)
          );
      }
    })
    .catch((err) =>
      console.log(
        `Err while getting a single event when creating a comment: ${err}`
      )
    );
});

// // ****************************************************************************************
// // GET route to get all the comments in any event
// // ****************************************************************************************

router.get("/api/events/:eventId/comments", (req, res) => {
  Comment.find()
    .then((commentsFromDB) =>
      res.status(200).json({ comments: commentsFromDB })
    )
    .catch((err) => next(err));
});

// router.post("/api/books", (req, res, next) => {
//   console.log(req.body);
//   Book.create(req.body)
//     .then((bookDoc) => res.status(200).json({ book: bookDoc }))
//     .catch((err) => next(err));
// });

// // ****************************************************************************************
// // POST route to delete the book
// // ****************************************************************************************

// // <form action="/books/{{this._id}}/delete" method="post">
// router.post("/api/books/:bookId/delete", (req, res) => {
//   Book.findByIdAndRemove(req.params.bookId)
//     .then(() => res.json({ message: "Successfully removed!" }))
//     .catch((err) => next(err));
// });

// // ****************************************************************************************
// // POST route to save the updates
// // ****************************************************************************************

// // <form action="/books/{{foundBook._id}}/update" method="POST">
// router.post("/api/books/:id/update", (req, res) => {
//   Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((updatedBook) => res.status(200).json({ book: updatedBook }))
//     .catch((err) => next(err));
// });

// // ****************************************************************************************
// // GET route for getting the book details
// // ****************************************************************************************

// router.get("/api/books/:someBookId", (req, res) => {
//   Book.findById(req.params.someBookId)
//     .populate("author")
//     .then((foundBook) => res.status(200).json({ book: foundBook }))
//     .catch((err) => next(err));
// });

module.exports = router;
