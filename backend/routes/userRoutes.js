const express = require("express");
const router = express.Router();
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("../controllers/usersController.js");

router.route("/")
    .get(getAllUsers)
    .post(createNewUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
