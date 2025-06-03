const userModel = require("../models/userModel");
const noteModel = require("../models/notesModel");
const { generateToken, verifyToken } = require("../utils/payloads");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class userCtrl {
  signUp = async (req, res) => {
    const { lastName, firstName, password, phone } = req.body;

    if (!lastName || !firstName || !password || !phone) {
      return res.status(400).json(" یکی از مقادیر الزامی وارد نشده");
    }

    const existPhone = await userModel.exists({ phone: phone });

    if (existPhone) {
      res.status(201).json("شماره تلفن قبلاً ثبت شده است");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = await bcrypt.hash(password, salt);

    try {
      const newUser = await userModel.create({
        lastName,
        firstName,
        password: hashPass,
        phone,
      });
      res.status(200).json(newUser);
    } catch (err) {
      return res.json("دارد مشکلی در سمت سرور وجود");
    }
  };

  signIn = async (req, res) => {
    const { password, phone } = req.body;

    try {
      const user = await userModel.findOne({ phone }).select("+password"); // Explicitly include password
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json("تلفن همراه یا رمز عبور اشتباه است");
      }

      // چک کردن وجود فیلد پسورد
      if (!user.password) {
        return res.status(500).json("رمز عبور کاربر ذخیره نشده است");
      }

      /*   const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json("تلفن همراه یا رمز عبور اشتباه است");
      }
*/

      const token = generateToken(user); //ساخت توکن

      const userWithoutPassword = user.toObject(); //حذف پسورد از ریسپانس جهت حفظ امنیت
      delete userWithoutPassword.password;

      res.status(200).json({
        message: "ورود موفقیت‌آمیز بود",
        token,
        user: userWithoutPassword,
      });
    } catch (err) {
      console.error("Signin Error:", err);
      res.status(500).json("خطای سرور");
    }
  };

  addNote = async (req, res) => {
    const { title, description, lable } = req.body;

    if (!title || !description) {
      res.json("مقادیر عنوان و توضیحات نوت شما وارد نشده است.");
    }

    try {
      const newNote = await noteModel.create({
        title,
        description,
        lable,
        owner: req.userId,
      });

      if (!newNote) {
        res.status(201).json("مشکلی در فرایند ذخیره یادداشت پیش آمد");
      }

      const updateUser = await userModel.findOneAndUpdate(
        req.userId, // فیلتر
        { $push: { notes: { title, description, lable } } }, // آپدیت
        { new: true }
      );
      /*const updateUserModel = await userModel.findByIdAndUpdate(
        
        { 
          $push: { notes: newNote._id },
        },
        { new: true }
      );
*/

      res.json(updateUser);
    } catch {
      res.json("مشکلی پیش امد");
    }
  };
}
module.exports = new userCtrl();
