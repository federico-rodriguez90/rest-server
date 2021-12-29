const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");

// GET
const getUsuarios = async (req = request, res = response) => {
  // Paginado
  const { limite = 5, desde = 0 } = req.query;
  const isActive = { estado: true };

  // const usuarios = await Usuario.find(isActive)
  //   .skip(Number(desde))
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments(isActive);

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(isActive),
    Usuario.find(isActive).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({ total, usuarios });
};

// POST
const postUsuarios = async (req, res = response) => {
  const { nombre, email, password, role } = req.body;

  const usuario = new Usuario({ nombre, email, password, role });

  //Encriptar Password
  const salt = bcrypt.genSaltSync(10);
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.json({ msg: "post API - controlador", usuario });
};

// PUT
const putUsuarios = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    rest.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, rest);

  res.json(usuario);
};

// DELETE
const deleteUsuarios = async (req, res = response) => {
  const { id } = req.params;

  // Para borrar fisicamente de la BD (No recomendable)
  // const usuario = Usuario.findByIdAndDelete(id);

  // Cambiar estado a false
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};

// PATCH
const patchUsuarios = (req, res = response) => {
  res.json({ msg: "patch API - controlador" });
};

module.exports = {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios,
  patchUsuarios,
};
