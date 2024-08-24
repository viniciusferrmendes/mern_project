const Note = require("../models/Note.js");
const User = require("../models/User.js");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found." });
    }

    const notesWithUser = await Promise.all(notes.map(async note => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }));

    res.json(notesWithUser);
});

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const duplicate = await Note.findOne({ title }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate note title." });
    }

    const noteObject = { user, title, text };

    const note = await Note.create(noteObject);

    if (note) {
        res.status(201).json({ message: `New note ${title} created.` });
    } else {
        res.status(400).json({ message: "Invalid note data received." });
    }
});

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required." });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: "Note not found." });
    }

    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate note title." });
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    res.json({ message: `Note ${updatedNote.title} updated.` });
});

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Note ID required." });
    }

    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: "Note not found." });
    }

    await note.deleteOne();

    res.json(`Note ${note.title} with ID ${id} deleted.`);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
