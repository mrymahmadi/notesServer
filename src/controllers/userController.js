const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class userCtrl {
  signUp = async (req, res) => {
    const { lastName, firstName, password, phone } = req.body;

    if (!lastName || !firstName || !password || !phone) {
      return res.status(400).json(" یکی از مقادیر الزامی وارد نشده");
    }

    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds);

    try {
      const newUser = await userModel.create({
        lastName,
        firstName,
        hashPass,
        phone,
      });
      res.status(200).json(newUser);
    } catch (err) {
      return res.json("دارد مشکلی در سمت سرور وجود");
    }
  };
}
module.exports = new userCtrl();
