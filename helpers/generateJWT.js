const jwt = require("jsonwebtoken");

// IMPORTANTE
// NO HAY QUE ALMACENAR DATOS SENSIBLES EN EL TOKEN

const generateJWT = (uid = "") => {
  //Return para poder hacer await cuando lo use.
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { generateJWT };
