const express = require("express");
const router = express.Router();
const userCtrl = require("../src/controllers/userController");
const checkAuthAndRole = require("../src/middlewares/authMiddleware");
const uploadImage = require("../src/middlewares/upload");

/**
 * @swagger
 * /signUp:
 *  post:
 *      summary: ثبت نام / ایجاد حساب کاربری
 *      responses:
 *          400:
 *              description: یکی از مقادیر الزامی برای ثبت نام وارد نشده است
 *          201:
 *              description: شماره تلفن قبلا ثبت شده است.
 *          200:
 *              description: ثبت نام موفقیت آمیز بود
 *
 */
router.post("/signUp", userCtrl.signUp);

router.post("/signIn", userCtrl.signIn);

router.post(
  "/addNote",
  checkAuthAndRole("USER"),
  uploadImage.single("image"),
  userCtrl.addNote
);

router.put("/editNote", checkAuthAndRole("USER"), userCtrl.editNote);

router.get("/allNotes", checkAuthAndRole("USER"), userCtrl.allNotes);

router.get("/oneNote/:_id", checkAuthAndRole("USER"), userCtrl.oneNote);

router.post("/addTask", checkAuthAndRole("USER"), userCtrl.addTask);
module.exports = router;
