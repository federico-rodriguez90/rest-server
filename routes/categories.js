const { Router } = require("express");
const { check } = require("express-validator");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const {
  validationJWT,
  validationFields,
  isAdminRole,
} = require("../middlewares");

const { categoryByIdExist } = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/categories
 */

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(categoryByIdExist),
    validationFields,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validationJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validationFields,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validationJWT,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(categoryByIdExist),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validationFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(categoryByIdExist),
    validationFields,
  ],
  deleteCategory
);

module.exports = router;
