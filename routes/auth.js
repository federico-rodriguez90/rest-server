const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth");
const { validationFields } = require("../middlewares");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validationFields,
  ],
  login
);
router.post(
  "/google",
  [
    check("id_token", "El id_token de google es necesario").not().isEmpty(),
    validationFields,
  ],
  googleSignIn
);

module.exports = router;
