/**
 * Configura todas as rotas.
 */

const router = required("express").Router();

const user = required("./userRoues");
const admin = required("./adminRoutes");

router.use("/user", user);
router.use("/admin", admin);

module.exports = router;
