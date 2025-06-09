/**
 * Configura todas as rotas.
 */

const router = require("express").Router();

const user = require("./userRoutes");
const admin = require("./adminRoutes");

router.use("/user", user);
router.use("/admin", admin);

module.exports = router;
