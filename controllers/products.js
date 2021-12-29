const { response } = require("express");
const { Product, Category } = require("../models");

const getProducts = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const isActive = { estado: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(isActive),
    Product.find(isActive)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre email")
      .populate("category", "nombre"),
  ]);

  res.json({ total, products });
};

const getProductById = async (req, res = response) => {
  const { id } = req.params;
  console.log(id);
  const product = await Product.findById(id)
    .populate("usuario", "nombre email")
    .populate("category", "nombre");

  res.json(product);
};

const createProduct = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;
  const nombre = body.nombre.toUpperCase();

  //Validar si existe el producto
  const productDB = await Product.findOne({ nombre });

  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.nombre} ya existe`,
    });
  }

  // Crear data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const product = new Product(data);

  //Guardar en DB
  await product.save();

  res.status(201).json(product);
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  //Actualizar
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json(product);
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  //Cambiar estado a false
  const productDeleted = await Product.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(productDeleted);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
