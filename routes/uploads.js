const { Router } = require("express");
const { check } = require("express-validator");

const {
  uploadFile,
  updateFile,
  getFile,
  updateImgCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const { validationFields, validateFileUpload } = require("../middlewares");

const router = Router();

router.post("/", validateFileUpload, uploadFile);

router.put(
  "/:coleccion/:id",
  [
    validateFileUpload,
    check("id", "El id debe ser de MongoDB").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "products"])
    ),
    validationFields,
  ],
  updateImgCloudinary
  // updateFile
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de MongoDB").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "products"])
    ),
    validationFields,
  ],
  getFile
);

module.exports = router;
