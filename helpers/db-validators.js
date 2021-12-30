const { Usuario, Category, Role, Product } = require("../models");

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
const categoryByIdExist = async (id) => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) {
    throw new Error(`La categoria no existe: ${id}`);
  }
};
const productByIdExist = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist) {
    throw new Error(`El producto no existe: ${id}`);
  }
};

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no esta permitida. ${colecciones.join(", ")}`
    );
  }

  return true;
};

module.exports = {
  isRoleValid,
  emailExist,
  userByIdExist,
  categoryByIdExist,
  productByIdExist,
  coleccionesPermitidas,
};
