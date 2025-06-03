/**
 * Configura todas as rotas.
 */

const router = require("express").Router();

const user = require("./userRoues");

router.use("/user", user);

module.exports = router;
