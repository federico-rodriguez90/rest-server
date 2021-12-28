const bcrypt = require("bcryptjs");
const { response } = require("express");

const Usuario = require("../models/usuario");
const { generateJWT } = require("../helpers/generateJWT");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //Verificar que el email exista
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "El email/password invalido (mail*borrar)" });
    }

    //Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "El email/password invalido (estado: false*borrar)" });
    }

    //Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "El email/password invalido (password*borrar)" });
    }

    //Generar JWT
    const token = await generateJWT(usuario.id);
    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo un error",
      error,
    });
  }
};

module.exports = { login };
