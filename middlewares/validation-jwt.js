const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validationJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token)
    return res.status(401).json({ msg: "No hay token en la petición." });

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //Leer usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res
        .status(404)
        .json({ msg: "Token no valido - Usuario no existente en BD." });
    }

    //Verificar si el uid esta con estado activo
    if (!usuario.estado) {
      return res
        .status(401)
        .json({ msg: "Token no valido - El usuario no esta activo." });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token invalido" });
  }
};

module.exports = { validationJWT };
