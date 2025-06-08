const userModel = require("../models/userModel");
const noteModel = require("../models/notesModel");
const taskModel = require("../models/taskModel");
const lableModel = require("../models/lableModel");
const { generateToken } = require("../utils/payloads");
const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");

class userCtrl {
  signUp = async (req, res) => {
    try {
      const { lastName, firstName, password, phone } = req.body;

      if (!lastName || !firstName || !password || !phone) {
        return res.status(400).json(" یکی از مقادیر الزامی وارد نشده");
      }

      const existPhone = await userModel.exists({ phone: phone });

      if (existPhone) {
        return res.status(409).json("شماره تلفن قبلاً ثبت شده است");
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = await bcrypt.hash(password, salt);

      const newUser = await userModel.create({
        lastName,
        firstName,
        password: hashPass,
        phone,
      });
      return res.status(201).json(newUser);
    } catch (err) {
      return res.status(500).json("دارد مشکلی در سمت سرور وجود");
    }
  };

  signIn = async (req, res) => {
    try {
      const { password, phone } = req.body;

      const user = await userModel.findOne({ phone }).select("+password");
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json("تلفن همراه یا رمز عبور اشتباه است");
      }

      const token = generateToken(user);

      const userWithoutPassword = user.toObject();
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
    try {
      const { title, description, lable } = req.body;
      const owner = req.user._id;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      if (!title || !description) {
        return res.json("مقادیر عنوان و توضیحات یادداشت شما وارد نشده است.");
      }

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

      const updateUser = await userModel.findByIdAndUpdate(
        owner,
        { $push: { notes: { title, description, lable, imageUrl } } },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "یادداشت با موفقیت اضافه شد", newNote });
    } catch {
      return res.status(500).json("مشکلی پیش امد");
    }
  };

  editNote = async (req, res) => {
    try {
      const { _id, title, description, lable } = req.body;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "هیچ داده‌ای برای آپدیت ارسال نشده است" });
      }

      if (!_id) {
        return res.status(400).json({ message: "فیلد _id الزامی است" });
      }

      if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "آیدی نامعتبر است" });
      }

      const findNote = await noteModel.findById(_id);
      if (!findNote) {
        return res.status(404).json({ message: "یادداشت مورد نظر یافت نشد" });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (lable !== undefined) updateData.lable = lable;

      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "هیچ فیلد معتبری برای آپدیت ارسال نشده است" });
      }

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
      const userId = req.user._id;
      console.log(userId);
      const notes = await noteModel.find({ owner: userId });

      return res
        .status(200)
        .json({ message: "یادداشت های شما:", notes: notes });
    } catch {
      return res.status(500).json("خطایی سمت سرور وجود دارد");
    }
  };

  oneNote = async (req, res) => {
    try {
      const { _id } = req.params._id;
      const note = await noteModel.findOne(_id);

      if (!note) {
        return res.status(404).json(" یادداشت یافت نشد");
      }

      return res.status(201).json({ message: "یادداشت شما:", note: note });
    } catch {
      return res.status(500).json("مشکلی سمت سرور وجود دارد");
    }
  };

  addTask = async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user._id;

      if (!content || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "مقدار صحیحی وارد نشده است" });
      }

      const newTask = await taskModel.create({
        content,
        owner: userId,
      });

      const updateUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { tasks: { content } } },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "برچسب با موفقیت اضافه شد", data: newTask });
    } catch {
      return res.status(500).json("مشکل سمت سرور ");
    }
  };

  doneTask = async (req, res) => {
    try {
      const userId = req.user._id;
      const _id = req.params._id;

      if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "آیدی نامعتبر است" });
      }

      const matchUser = await taskModel.find(userId);
      if (!matchUser) {
        return res.status(404).json({ response: "چنین کاربری یافت نشد" });
      }

      const findTask = await taskModel.findById(_id);
      if (!findTask) {
        return res.status(404).json({ response: "تسک یافت نشد" });
      }

      const done = true;
      const updateTask = await taskModel.findByIdAndUpdate(
        _id,
        {
          $set: { done: done },
        },
        {
          new: true,
        }
      );

      const updateUser = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: { "tasks.$[elem].done": done },
        },
        {
          new: true,
          arrayFilters: [{ "elem._id": updateTask._id }],
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

  allTasks = async (req, res) => {
    try {
      const userId = req.user._id;
      const ownTasks = await noteModel.find({ owner: userId });

      if (!ownTasks) {
        res.status(404).json({ message: "تسکی ندارید" });
      }
      return res.status(200).json({ message: "تسک های شما:", tasks: ownTasks });
    } catch {
      return res.status(500).json("خطایی سمت سرور وجود دارد");
    }
  };

  oneTask = async (req, res) => {
    try {
      const { _id } = req.params._id;
      const task = await taskModel.findOne(_id);

      if (!note) {
        return res.status(404).json(" تسک یافت نشد");
      }

      return res.status(201).json({ message: "تسک شما:", task: task });
    } catch {
      return res.status(500).json("مشکلی سمت سرور وجود دارد");
    }
  };

  addlable = async (req, res) => {
    try {
      const { name } = req.body;

      const createlable = await lableModel.create({ name });

      res
        .status(201)
        .json({ response: "با موفقیت اضافه شد", data: createlable });
    } catch (error) {
      res.status(500).json({ response: "مشکلی سمت سرور وجود دارد" });
    }
  };

  addlableToNote = async (req, res) => {
    try {
      const { name, noteId } = req.body;

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

      const lable = await lableModel.findOne({ name });
      if (!lable) {
        return res.status(404).json({
          success: false,
          message: "لیبل با این نام یافت نشد",
        });
      }

      await noteModel.findByIdAndUpdate(
        noteId,
        {
          $addToSet: { lables: lable._id },
        },
        { new: true }
      );

      await lableModel.findByIdAndUpdate(lable._id, {
        $addToSet: { notes: note._id },
      });

      const updatedNote = await noteModel
        .findById(noteId)
        .populate("lables", "name");

      return res.status(201).json({
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
