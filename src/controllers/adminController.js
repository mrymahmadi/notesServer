const adminModel = require("../models/adminModel");
const { generateToken } = require("../utils/payloads");
const bcrypt = require("bcryptjs");

class adminCtrl {
  signUp = async (req, res) => {
    try {
      const { lastName, firstName, password, phone } = req.body;

      if (!lastName || !firstName || !password || !phone) {
        return res.status(400).json(" یکی از مقادیر الزامی وارد نشده");
      }

      const existPhone = await adminModel.exists({ phone: phone });

      if (existPhone) {
        return res.status(409).json("شماره تلفن قبلاً ثبت شده است");
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = await bcrypt.hash(password, salt);

      const newAdmin = await adminModel.create({
        lastName,
        firstName,
        password: hashPass,
        phone,
      });
      return res.status(201).json(newAdmin);
    } catch (err) {
      return res.status(500).json("دارد مشکلی در سمت سرور وجود");
    }
  };

  signIn = async (req, res) => {
    try {
      const { password, phone } = req.body;

      const admin = await adminModel.findOne({ phone }).select("+password");
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(400).json("تلفن همراه یا رمز عبور اشتباه است");
      }

      const token = generateToken(admin);

      const adminWithoutPassword = admin.toObject();
      delete adminWithoutPassword.password;

      return res.status(200).json({
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
