const Role = require("../models/role");
const Usuario = require("../models/usuario");

const isRoleValid = async (role = "") => {
  const existeRole = await Role.findOne({ role });
  if (!existeRole) {
    throw new Error(`El rol ${role} no esta registrado`);
  }
};

const emailExist = async (email = "") => {
  const emailExiste = await Usuario.findOne({ email });
  if (emailExiste) {
    throw new Error(`El correo ${email} ya existe`);
  }
};
const userByIdExist = async (id) => {
  const userExiste = await Usuario.findById(id);
  if (!userExiste) {
    throw new Error(`El ID no existe: ${id}`);
  }
};

module.exports = { isRoleValid, emailExist, userByIdExist };
