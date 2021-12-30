const validationFields = require("../middlewares/validation-fields");
const validationJWT = require("../middlewares/validation-jwt");
const validationRoles = require("../middlewares/validation-roles");
const validateFileUpload = require("../middlewares/validation-files");

module.exports = {
  ...validationFields,
  ...validationJWT,
  ...validationRoles,
  ...validateFileUpload,
};
