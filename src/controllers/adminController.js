const adminModel = require("../models/adminModel");
const { generateToken } = require("../utils/payloads");
const bcrypt = require("bcryptjs");

class adminCtrl {
  signUp = async (req, res) => {
    const { lastName, firstName, password, phone } = req.body;

    if (!lastName || !firstName || !password || !phone) {
      return res.status(400).json(" یکی از مقادیر الزامی وارد نشده");
    }

    const existPhone = await adminModel.exists({ phone: phone });

    if (existPhone) {
      res.status(201).json("شماره تلفن قبلاً ثبت شده است");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = await bcrypt.hash(password, salt);

    try {
      const newAdmin = await adminModel.create({
        lastName,
        firstName,
        password: hashPass,
        phone,
      });
      res.status(200).json(newAdmin);
    } catch (err) {
      return res.json("دارد مشکلی در سمت سرور وجود");
    }
  };

  signIn = async (req, res) => {
    const { password, phone } = req.body;

    try {
      const admin = await adminModel.findOne({ phone }).select("+password");
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(400).json("تلفن همراه یا رمز عبور اشتباه است");
      }

      if (!admin.password) {
        return res.status(500).json("رمز عبور ادمین ذخیره نشده است");
      }

      const token = generateToken(admin);

      const adminWithoutPassword = admin.toObject();
      delete adminWithoutPassword.password;

      res.status(200).json({
        message: "ورود موفقیت‌آمیز بود",
        token,
        admin: adminWithoutPassword,
      });
    } catch (err) {
      console.error("Signin Error:", err);
      return res.status(500).json("خطای سرور");
    }
  };
}

module.exports = new adminCtrl();
