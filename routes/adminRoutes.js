const express = require("express");
const router = express.Router();
const adminCtrl = require("../src/controllers/adminController");

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: ثبت‌نام ادمین جدید
 *     description: ایجاد حساب ادمین جدید با نام، نام خانوادگی، شماره تلفن و رمز عبور
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastName
 *               - firstName
 *               - password
 *               - phone
 *             properties:
 *               lastName:
 *                 type: string
 *                 example: حسینی
 *               firstName:
 *                 type: string
 *                 example: محمد
 *               password:
 *                 type: string
 *                 example: "123456"
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *     responses:
 *       201:
 *         description: ثبت‌نام موفق
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       409:
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
 *               example: مشکلی در سمت سرور وجود دارد
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *               password:
 *                 type: string
 *                 example: "123456"
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
 *                 admin:
 *                   $ref: '#/components/schemas/AdminWithoutPassword'
 *       401:
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
