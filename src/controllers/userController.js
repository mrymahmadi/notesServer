const userModel = require("../models/userModel");
const noteModel = require("../models/notesModel");
const taskModel = require("../models/taskModel");
const labelModel = require("../models/labelModel");
const { generateToken } = require("../utils/payloads");
const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");

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
      return res.status(500).json("خطای سرور");
    }
  };

  addNote = async (req, res) => {
    const { title, description, lable, owner } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.fileName}` : null;

    if (!title || !description || !owner) {
      return res.json(
        "مقادیر عنوان و توضیحات یا ایدی سازنده یادداشت شما وارد نشده است."
      );
    }

    try {
      const newNote = await noteModel.create({
        title,
        description,
        lable,
        owner,
        imageUrl,
      });

      if (!newNote) {
        return res.status(500).json("مشکلی در فرایند ذخیره یادداشت پیش آمد");
      }

      const updateUser = await userModel.findOneAndUpdate(
        req.userId,
        { $push: { notes: { title, description, lable, imageUrl } } },
        { new: true }
      );

      return res.json(updateUser);
    } catch {
      return res.json("مشکلی پیش امد");
    }
  };

  editNote = async (req, res) => {
    try {
      const { _id, title, description, lable, imageUrl } = req.body;

      // 1. بررسی وجود بدنه درخواست
      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "هیچ داده‌ای برای آپدیت ارسال نشده است" });
      }

      // 2. بررسی وجود آیدی
      if (!_id) {
        return res.status(400).json({ message: "فیلد _id الزامی است" });
      }

      // 3. بررسی معتبر بودن آیدی
      if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "آیدی نامعتبر است" });
      }

      // 4. بررسی وجود یادداشت
      const findNote = await noteModel.findById(_id);
      if (!findNote) {
        return res.status(404).json({ message: "یادداشت مورد نظر یافت نشد" });
      }

      // 5. ساخت آبجکت آپدیت
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (lable !== undefined) updateData.lable = lable;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      // 6. اگر هیچ فیلدی برای آپدیت وجود ندارد
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "هیچ فیلد معتبری برای آپدیت ارسال نشده است" });
      }

      // 7. انجام آپدیت
      const updatedNote = await noteModel.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true }
      );

      return res.status(200).json({
        message: "آپدیت با موفقیت انجام شد",
        data: updatedNote,
      });
    } catch (error) {
      console.error("خطا در آپدیت یادداشت:", error);
      return res.status(500).json({ message: "خطای سرور در پردازش درخواست" });
    }
  };

  allNotes = async (req, res) => {
    try {
      const notes = await noteModel.find();
      return res.status(200).json(notes);
    } catch {
      return res.status(500).json("خطایی سمت سرور وجود دارد");
    }
  };

  oneNote = async (req, res) => {
    const _id = req.params._id;
    try {
      const findNote = await noteModel.findById(_id);

      if (!findNote) {
        return res.status(501).json(" یادداشت یافت نشد");
      }

      return res.status(200).json(findNote);
    } catch {
      return res.status(201).json("مشکلی سمت سرور وجود دارد");
    }
  };

  addTask = async (req, res) => {
    const { content, userId } = req.body;

    if (!content || !userId || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "داده های مورد نیاز وارد نشده است" });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "آیدی نامعتبر است" });
    }

    const existUser = await userModel.exists({ _id: userId });

    if (!existUser) {
      return res.status(201).json({ response: "چنین کاربری یافت نشد" });
    }

    try {
      const newTask = await taskModel.create({
        content,
        userId,
      });

      const updateUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { tasks: { content } } },
        { new: true }
      );

      return res.status(200).json(updateUser);
    } catch {
      return res.status(500).json("مشکل سمت سرور ");
    }
  };

  doneTask = async (req, res) => {
    const { userId } = req.body;
    const _id = req.params._id;

    try {
      if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "آیدی نامعتبر است" });
      }

      const existUser = await userModel.findById(userId);
      if (!existUser) {
        return res.status(404).json({ response: "چنین کاربری یافت نشد" });
      }

      const findTask = await taskModel.findById(_id);
      if (!findTask) {
        return res.status(404).json({ response: "تسک یافت نشد" });
      }

      const updateTask = await taskModel.findByIdAndUpdate(_id, {
        $set: { done: true },
      });

      const updateUser = await userModel.findByIdAndUpdate(
        existUser._id,
        {
          $set: { "tasks.$[elem].done": true },
        },
        {
          new: true,
          arrayFilters: [{ "elem._id": findTask._id }],
        }
      );

      return res
        .status(200)
        .json({ response: "تسک با موفقیت آپدیت شد", data: updateTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ response: "خطای سمت سرور رخ داده است" });
    }
  };

  addLabel = async (req, res) => {
    const { name } = req.body;

    try {
      const createLabel = await labelModel.create({ name });

      res
        .status(200)
        .json({ response: "با موفقیت اضافه شد", data: createLabel });
    } catch (error) {
      res.status(500).json({ response: "مشکلی سمت سرور وجود دارد" });
    }
  };

  addLabelToNote = async (req, res) => {
    const { name, noteId } = req.body;

    try {
      if (!name || !noteId) {
        return res.status(400).json({
          success: false,
          message: "نام لیبل و شناسه یادداشت الزامی است",
        });
      }

      const note = await noteModel.findById(noteId);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: "یادداشت یافت نشد",
        });
      }

      const label = await labelModel.findOne({ name });
      if (!label) {
        return res.status(404).json({
          success: false,
          message: "لیبل با این نام یافت نشد",
        });
      }

      await noteModel.findByIdAndUpdate(
        noteId,
        {
          $addToSet: { labels: label._id },
        },
        { new: true }
      );

      await labelModel.findByIdAndUpdate(label._id, {
        $addToSet: { notes: note._id },
      });

      const updatedNote = await noteModel
        .findById(noteId)
        .populate("labels", "name");

      return res.status(200).json({
        success: true,
        message: "لیبل با موفقیت به یادداشت اضافه شد",
        data: updatedNote,
      });
    } catch (error) {
      console.error("خطا:", error);
      return res.status(500).json({
        success: false,
        message: "خطا در افزودن لیبل",
      });
    }
  };
}
module.exports = new userCtrl();
