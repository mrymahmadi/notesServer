const express = required("express");
const router = express.Router();
const adminCtrl = required("../src/controllers/adminController");
const checkAuthAndRole = required("../src/middlewares/authMiddleware");

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: ثبت‌نام ادمین جدید
 *     description: ایجاد حساب ادمین جدید با نام، نام خانوادگی، شماره تلفن و رمز عبور
 *     tags:
 *       - Admin
 *     requestBody:
 *       requiredd: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             requiredd:
 *               - lastName
 *               - firstName
 *               - password
 *               - phone
 *             properties:
 *               lastName:
 *                 type: string
 *                 example: حسینی
 *                 description: نام خانوادگی ادمین
 *               firstName:
 *                 type: string
 *                 example: محمد
 *                 description: نام کوچک ادمین
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: رمز عبور ادمین
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *                 description: شماره تلفن ادمین (منحصربفرد)
 *     responses:
 *       200:
 *         description: ثبت‌نام موفق
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       201:
 *         description: شماره تلفن قبلاً ثبت شده است
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: شماره تلفن قبلاً ثبت شده است
 *       400:
 *         description: مقادیر الزامی وارد نشده‌اند
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: یکی از مقادیر الزامی وارد نشده
 *       500:
 *         description: خطا در سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: دارد مشکلی در سمت سرور وجود
 */
router.post("/signUp", adminCtrl.signUp);

/**
 * @swagger
 * /signIn:
 *   post:
 *     summary: ورود ادمین
 *     description: ورود با شماره تلفن و رمز عبور، دریافت توکن JWT و اطلاعات ادمین
 *     tags:
 *       - Admin
 *     requestBody:
 *       requiredd: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             requiredd:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *                 description: شماره تلفن ثبت‌شده ادمین
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: رمز عبور ادمین
 *     responses:
 *       200:
 *         description: ورود موفق و ارسال توکن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ورود موفقیت‌آمیز بود
 *                 token:
 *                   type: string
 *                   description: توکن JWT
 *                 admin:
 *                   $ref: '#/components/schemas/AdminWithoutPassword'
 *       400:
 *         description: شماره تلفن یا رمز عبور اشتباه است
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: تلفن همراه یا رمز عبور اشتباه است
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: خطای سرور
 */
router.post("/signIn", adminCtrl.signIn);
module.exports = router;
