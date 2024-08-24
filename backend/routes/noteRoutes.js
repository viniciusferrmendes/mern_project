const express = require("express");
const router = express.Router();
const { getAllNotes, createNewNote, updateNote, deleteNote } = require("../controllers/notesController.js");

router.route("/")
    .get(getAllNotes)
    .post(createNewNote)
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;
