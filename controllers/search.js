const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Category, Product } = require("../models");

const coleccionesPermitidas = ["usuarios", "categories", "products", "roles"];

const serchUsers = async (termino = "", res = response) => {
  const isMongoID = ObjectId.isValid(termino); // TRUE

  //Buscar por ID
  if (isMongoID) {
    const user = await Usuario.findById(termino);
    return res.json({
      results: user ? [user] : [],
    });
  }

  //Expresion regular para que la busqueda no sea tan extricta
  const regex = new RegExp(termino, "i");

  //Buscar por termino (nombre, email, etc)
  const users = await Usuario.find({
    $or: [{ nombre: regex }, { email: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: users,
  });
};

const serchCategories = async (termino = "", res = response) => {
  const isMongoID = ObjectId.isValid(termino); // TRUE

  //Buscar por ID
  if (isMongoID) {
    const category = await Category.findById(termino);
    return res.json({
      results: category ? [category] : [],
    });
  }

  //Expresion regular para que la busqueda no sea tan extricta
  const regex = new RegExp(termino, "i");

  //Buscar por termino (nombre, email, etc)
  const categories = await Category.find({ nombre: regex, estado: true });

  res.json({
    results: categories,
  });
};

const serchProducts = async (termino = "", res = response) => {
  const isMongoID = ObjectId.isValid(termino); // TRUE

  //Buscar por ID
  if (isMongoID) {
    const product = await Product.findById(termino).populate(
      "category",
      "name"
    );
    return res.json({
      results: product ? [product] : [],
    });
  }

  //Expresion regular para que la busqueda no sea tan extricta
  const regex = new RegExp(termino, "i");

  //Buscar por termino (nombre, email, etc)
  const products = await Product.find({ nombre: regex, estado: true }).populate(
    "category",
    "name"
  );

  res.json({
    results: products,
  });
};

const search = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      serchUsers(termino, res);
      break;
    case "categories":
      serchCategories(termino, res);
      break;
    case "products":
      serchProducts(termino, res);
      break;

    default:
      return res.status(500).json({
        msg: "Se le olvido hacer esta busqueda",
      });
  }
};

module.exports = { search };
