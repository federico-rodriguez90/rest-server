const dbValidators = require("./db-validators");
const generateJWT = require("./generateJWT");
const googleVerify = require("./google-verify");
const uploadFiles = require("./uploadFile");

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFiles,
};
