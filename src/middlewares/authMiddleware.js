const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const checkAuthAndRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ error: "توکن احراز هویت ارائه نشده است" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: "کاربر یافت نشد" });
      }

      if (user.Role !== requiredRole) {
        return res
          .status(403)
          .json({ error: "شما مجوز دسترسی به این بخش را ندارید" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("خطای میان‌افزار احراز هویت:", err);
      res.status(401).json({ error: "توکن نامعتبر یا منقضی شده است" });
    }
  };
};

module.exports = checkAuthAndRole;
