const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
  ],
  //   [
  //     check("nombre", "El nombre es obligatiorio").not().isEmpty(),
  //     check("email", "El email es invalido").isEmail(),
  //     check("email").custom(emailExist),
  //     check("role").custom(isRoleValid),
  //     validationFields,
  //   ],
  login
);

module.exports = router;
