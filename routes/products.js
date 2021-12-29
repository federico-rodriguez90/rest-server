const { Router } = require("express");
const { check } = require("express-validator");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const {
  validationJWT,
  validationFields,
  isAdminRole,
} = require("../middlewares");

const {
  productByIdExist,
  categoryByIdExist,
} = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/products
 */

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(productByIdExist),
    validationFields,
  ],
  getProductById
);

router.post(
  "/",
  [
    validationJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("category", "No es un id de Mongo valido").isMongoId(),
    check("category").custom(categoryByIdExist),
    validationFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validationJWT,
    // check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(productByIdExist),
    validationFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validationJWT,
    isAdminRole,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(productByIdExist),
    validationFields,
  ],
  deleteProduct
);

module.exports = router;
