const User = require("../models/User.js");
const Note = require("../models/Note.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
        return res.status(400).json({ message: "No users found." });
    }
    res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username." });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject = { username, "password": hashedPwd, roles };

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created.` });
    } else {
        res.status(400).json({ message: "Invalid user data received." });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }

    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username." });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: `${username} updated.` });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "User ID required." });
    }

    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: "User has assigned notes." });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }

    await user.deleteOne();

    res.json(`Username ${user.username} with ID ${id} deleted.`);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
