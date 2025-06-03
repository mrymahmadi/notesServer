const express = require("express");
const router = express.Router();
const userCtrl = require("../src/controllers/userController");

router.post("/signUp", userCtrl.signUp);

module.exports = router;
