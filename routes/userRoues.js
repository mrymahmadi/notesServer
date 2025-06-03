const express = require("express");
const router = express.Router();
const userCtrl = require("../src/controllers/userController");
const checkAuthAndRole = require("../src/middlewares/authMiddleware");

router.post("/signUp", userCtrl.signUp);
router.post("/signIn", userCtrl.signIn);
router.post("/addNote", checkAuthAndRole("USER"), userCtrl.addNote);

module.exports = router;
