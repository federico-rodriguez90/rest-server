const { response } = require("express");
const path = require("path");
const fs = require("fs");

const { Usuario, Product } = require("../models");
const { uploadFiles } = require("../helpers");

const uploadFile = async (req, res = response) => {
  try {
    // Imagenes. Undefined para omitir la extension del archivo
    const nombre = await uploadFiles(req.files, undefined, "images");

    // Txt, md
    // const nombre = await uploadFiles(req.files, ["txt", "md"], "texts");

    res.json({ nombre });
  } catch (msg) {
    res.status(500).json({ msg });
  }
};

const updateFile = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `El usuario con el id: ${id} no existe` });
      }
      break;

    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `El producto con el id: ${id} no existe` });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    // Borrar img del Servidor
    const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const nombre = await uploadFiles(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

module.exports = { uploadFile, updateFile };
