const bcrypt = require("bcryptjs");
const { response } = require("express");

const Usuario = require("../models/usuario");

const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, email } = await googleVerify(id_token);

    //Verificar que el email exista
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      //Crear usuario
      const data = {
        nombre,
        email,
        password: "cualquierCosa",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si el usuario en DB no esta activo
    if (!usuario.estado) {
      return res
        .status(401)
        .json({ msg: "Hable con el administrador. El usuario esta bloqueado" });
    }

    //Generar JWT
    const token = await generateJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "El token de Google es invalido",
    });
  }
};

module.exports = { login, googleSignIn };
