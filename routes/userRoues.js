const express = require("express");
const router = express.Router();
const userCtrl = require("../src/controllers/userController");
const checkAuthAndRole = require("../src/middlewares/authMiddleware");
const uploadImage = require("../src/middlewares/upload");

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: ثبت‌نام کاربر جدید
 *     description: ایجاد حساب کاربری جدید با نام، نام خانوادگی، شماره تلفن و رمز عبور
 *     tags:
 *       - Auth
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
 *                 example: رضایی
 *                 description: نام خانوادگی کاربر
 *               firstName:
 *                 type: string
 *                 example: علی
 *                 description: نام کوچک کاربر
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: رمز عبور کاربر
 *               phone:
 *                 type: string
 *                 example: "09121234567"
 *                 description: شماره تلفن کاربر (منحصربفرد)
 *     responses:
 *       201:
 *         description: ثبت‌نام موفق
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description:  شماره تلفن قبلاً ثبت شده است یا یکی از مقادیر الزامی وارد نشده است
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *
 *       500:
 *         description: خطا در سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: دارد مشکلی در سمت سرور وجود
 */
router.post("/signUp", userCtrl.signUp);

/**
 * @swagger
 * /signIn:
 *   post:
 *     summary: ورود کاربر
 *     description: ورود با شماره تلفن و رمز عبور، دریافت توکن JWT و اطلاعات کاربر
 *     tags:
 *       - Auth
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
 *                 description: شماره تلفن ثبت‌شده کاربر
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: رمز عبور کاربر
 *     responses:
 *       201:
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
 *                 user:
 *                   $ref: '#/components/schemas/UserWithoutPassword'
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
router.post("/signIn", userCtrl.signIn);

/**
 * @swagger
 * /addNote:
 *   post:
 *     summary: افزودن یادداشت جدید
 *     description: ایجاد یک یادداشت جدید با عنوان، توضیح، لیبل، مالک و در صورت وجود تصویر
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - owner
 *             properties:
 *               title:
 *                 type: string
 *                 description: عنوان یادداشت
 *                 example: یادداشت نمونه
 *               description:
 *                 type: string
 *                 description: توضیحات یادداشت
 *                 example: این یک یادداشت نمونه است
 *               lable:
 *                 type: string
 *                 description: نام لیبل یادداشت
 *                 example: مهم
 *               owner:
 *                 type: string
 *                 description: آیدی مالک یادداشت
 *                 example: 605c5d9f2f1b2c3a4d5e6789
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: تصویر مربوط به یادداشت (اختیاری)
 *     responses:
 *       201:
 *         description: یادداشت با موفقیت ایجاد و کاربر آپدیت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: داده کاربر به‌روز شده شامل لیست یادداشت‌ها
 *       400:
 *         description: فیلدهای اجباری ارسال نشده‌اند
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: مقادیر عنوان و توضیحات یا ایدی سازنده یادداشت شما وارد نشده است.
 *       500:
 *         description: خطا در ذخیره یادداشت یا خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: مشکلی در فرایند ذخیره یادداشت پیش آمد
 */
router.post(
  "/addNote",
  checkAuthAndRole("USER"),
  uploadImage.single("image"),
  userCtrl.addNote
);

/**
 * @swagger
 * /editNote:
 *   put:
 *     summary: ویرایش یک یادداشت موجود
 *     description: با ارسال داده‌های جدید (عنوان، توضیح، لیبل، تصویر) و آیدی یادداشت، یادداشت مورد نظر به‌روزرسانی می‌شود.
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *                 description: آیدی یادداشت برای ویرایش
 *                 example: 665f21d2a3e99c5d7890b123
 *               title:
 *                 type: string
 *                 description: عنوان جدید یادداشت
 *                 example: عنوان به‌روزرسانی شده
 *               description:
 *                 type: string
 *                 description: توضیح جدید یادداشت
 *                 example: توضیح به‌روزرسانی شده
 *               lable:
 *                 type: string
 *                 description: نام لیبل جدید
 *                 example: لیبل جدید
 *               imageUrl:
 *                 type: string
 *                 description: آدرس تصویر جدید
 *                 example: http://example.com/image.jpg
 *     responses:
 *       200:
 *         description: یادداشت با موفقیت ویرایش شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: آپدیت با موفقیت انجام شد
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     lable:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: خطا در ورودی‌ها (فیلدهای لازم ارسال نشده یا آیدی نامعتبر)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: هیچ داده‌ای برای آپدیت ارسال نشده است
 *       404:
 *         description: یادداشت مورد نظر یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: یادداشت مورد نظر یافت نشد
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: خطای سرور در پردازش درخواست
 */
router.put("/editNote", checkAuthAndRole("USER"), userCtrl.editNote);

/**
 * @swagger
 * /allNotes:
 *   get:
 *     summary: دریافت تمام یادداشت‌ها
 *     description: این endpoint تمام یادداشت‌های موجود را بازیابی و برمی‌گرداند.
 *     tags:
 *       - Notes
 *     responses:
 *       200:
 *         description: لیست تمام یادداشت‌ها با موفقیت برگردانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   photo:
 *                     type: string
 *                   lables:
 *                     type: array
 *                     items:
 *                       type: string
 *                   owner:
 *                     type: string
 *       500:
 *         description: خطا در سمت سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: خطایی سمت سرور وجود دارد
 */
router.get("/allNotes", checkAuthAndRole("USER"), userCtrl.allNotes);

/**
 * @swagger
 * /oneNote/{_id}:
 *   get:
 *     summary: دریافت یک یادداشت بر اساس آیدی
 *     description: با ارسال آیدی یادداشت، اطلاعات کامل آن یادداشت برگردانده می‌شود.
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: آیدی یادداشت
 *         schema:
 *           type: string
 *           example: 665f21d2a3e99c5d7890b123
 *     responses:
 *       200:
 *         description: یادداشت مورد نظر پیدا و برگردانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 photo:
 *                   type: string
 *                 lables:
 *                   type: array
 *                   items:
 *                     type: string
 *                 owner:
 *                   type: string
 *       404:
 *         description: یادداشت یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: یادداشت یافت نشد
 *       500:
 *         description: مشکل سمت سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: مشکلی سمت سرور وجود دارد
 */
router.get("/oneNote/:_id", checkAuthAndRole("USER"), userCtrl.oneNote);

/**
 * @swagger
 * /addTask:
 *   post:
 *     summary: افزودن تسک جدید برای کاربر
 *     description: با ارسال متن تسک و آیدی کاربر، تسک جدید ایجاد شده و به لیست تسک‌های کاربر اضافه می‌شود.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *             properties:
 *               content:
 *                 type: string
 *                 example: انجام پروژه X تا شنبه
 *                 description: متن یا توضیح تسک
 *               userId:
 *                 type: string
 *                 example: 665f1e70b1234c2d50e2e7a5
 *                 description: آیدی کاربر
 *     responses:
 *       201:
 *         description: تسک با موفقیت اضافه شد و اطلاعات به‌روزرسانی شده کاربر برگشت داده می‌شود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         example: انجام پروژه X تا شنبه
 *       400:
 *         description: داده‌های ورودی ناقص یا آیدی نامعتبر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: داده های مورد نیاز وارد نشده است
 *       404:
 *         description: کاربر یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: چنین کاربری یافت نشد
 *       500:
 *         description: خطای سمت سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: مشکل سمت سرور
 */

router.post("/addTask", checkAuthAndRole("USER"), userCtrl.addTask);

/**
 * @swagger
 * /doneTask/{_id}:
 * put:
 *     summary: علامت زدن تسک به‌عنوان انجام‌شده
 *     description: "با ارائه آیدی تسک و آیدی کاربر، تسک مشخص‌شده به حالت done: true بروزرسانی می‌شود."
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: آیدی تسک
 *         schema:
 *           type: string
 *           example: 665f21d2a3e99c5d7890b123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 665f1e70b1234c2d50e2e7a5
 *     responses:
 *       200:
 *         description: "تسک با موفقیت آپدیت شد"
 *       400:
 *         description: "آیدی نامعتبر است"
 *       404:
 *         description: "کاربر یا تسک یافت نشد"
 *       500:
 *         description: "خطای داخلی سرور"
 */
router.put("/doneTask/:_id", checkAuthAndRole("USER"), userCtrl.doneTask);
/***
 * @swagger
 * /user/allTasks:
 *   post:
 *      tags:
 *        - Tasks
 *      summary: دریافت همه تسک‌های متعلق به کاربر
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: لیست تسک‌ها با موفقیت بازیابی شد
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "تسک های شما:"
 *                  tasks:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Task'
 *        404:
 *          description: تسکی یافت نشد
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "تسکی ندارید"
 *        500:
 *          description: خطای داخلی سرور
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "خطایی سمت سرور وجود دارد"
 */
router.get("/allTasks", checkAuthAndRole("USER"), userCtrl.allTasks);

/**
 * @swagger
 * user/oneTask/{id}:
 *    get:
 *      tags:
 *        - Tasks
 *      summary: دریافت یک تسک خاص با استفاده از آیدی
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *          description: آیدی تسک
 *      responses:
 *        200:
 *          description: تسک با موفقیت یافت شد
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "تسک شما:"
 *                  task:
 *                    $ref: '#/components/schemas/Task'
 *        404:
 *          description: تسک یافت نشد
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "تسک یافت نشد"
 *        500:
 *          description: خطای داخلی سمت سرور
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "مشکلی سمت سرور وجود دارد"
 */
router.get("/oneTask/:_id", checkAuthAndRole("USER"), userCtrl.oneTask);

/**
 * @swagger
 * /user/lables:
 *   post:
 *     summary: ایجاد لیبل جدید
 *     description: این API یک لیبل جدید را با نام مشخص‌شده در دیتابیس ذخیره می‌کند.
 *     tags:
 *       - lables
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "فوری"
 *                 description: نام لیبل جدید
 *     responses:
 *       201:
 *         description: لیبل با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: با موفقیت اضافه شد
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "665f20e9b1234c2d50e2f123"
 *                     name:
 *                       type: string
 *                       example: "فوری"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ورودی نامعتبر (مثلاً خالی بودن name)
 *       500:
 *         description: خطای سمت سرور
 */
router.post("/addlable", checkAuthAndRole("USER"), userCtrl.addlable);

/**
 * @swagger
 * /api/notes/add-lable:
 *   post:
 *     summary: افزودن لیبل به یادداشت
 *     description: افزودن یک لیبل موجود به یادداشت با استفاده از نام لیبل و آیدی یادداشت.
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - noteId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "مهم"
 *               noteId:
 *                 type: string
 *                 example: "665f1e70b1234c2d50e2e7a5"
 *     responses:
 *       200:
 *         description: لیبل با موفقیت به یادداشت اضافه شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: لیبل با موفقیت به یادداشت اضافه شد
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     lables:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *       400:
 *         description: ورودی نامعتبر
 *       404:
 *         description: یادداشت یا لیبل یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.put(
  "/addlableToNote",
  checkAuthAndRole("USER"),
  userCtrl.addlableToNote
);

module.exports = router;
