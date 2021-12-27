const { Router } = require("express");
const { check } = require("express-validator");
const { validationFields } = require("../middlewares/validation-fields");
const {
  isRoleValid,
  emailExist,
  userByIdExist,
} = require("../helpers/db-validators");

const {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios,
  patchUsuarios,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", getUsuarios);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(userByIdExist),
    check("role").custom(isRoleValid),
    validationFields,
  ],
  putUsuarios
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatiorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("email", "El email es invalido").isEmail(),
    check("email").custom(emailExist),
    check("role").custom(isRoleValid),
    validationFields,
  ],
  postUsuarios
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(userByIdExist),
    validationFields,
  ],
  deleteUsuarios
);

router.patch("/:id", patchUsuarios);

module.exports = router;
