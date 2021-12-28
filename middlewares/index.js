const validationFields = require("../middlewares/validation-fields");
const validationJWT = require("../middlewares/validation-jwt");
const validationRoles = require("../middlewares/validation-roles");

module.exports = {
  ...validationFields,
  ...validationJWT,
  ...validationRoles,
};
