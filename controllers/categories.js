const { response } = require("express");
const { Category } = require("../models");

const getCategories = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const isActive = { estado: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(isActive),
    Category.find(isActive)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre email"),
  ]);

  res.json({ total, categories });
};

const getCategoryById = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate(
    "usuario",
    "nombre email"
  );

  res.json(category);
};

const createCategory = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoryDB = await Category.findOne({ nombre });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoría ${categoryDB.nombre} ya existe`,
    });
  }
  // Crear data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const category = new Category(data);

  //Guardar en DB
  await category.save();

  res.status(201).json({ category });
};

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  //Actualizar
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json(category);
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  //Cambiar estado a false
  const category = await Category.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(category);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
