const { response } = require("express");
const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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

// Este update es para cargar imagenes y almacenarlas localmente( se reemplaza por endpoint de cloudinary)
// const updateFile = async (req, res = response) => {
//   const { coleccion, id } = req.params;

//   let modelo;

//   switch (coleccion) {
//     case "usuarios":
//       modelo = await Usuario.findById(id);
//       if (!modelo) {
//         return res
//           .status(400)
//           .json({ msg: `El usuario con el id: ${id} no existe` });
//       }
//       break;

//     case "products":
//       modelo = await Product.findById(id);
//       if (!modelo) {
//         return res
//           .status(400)
//           .json({ msg: `El producto con el id: ${id} no existe` });
//       }
//       break;

//     default:
//       return res.status(500).json({ msg: "Se me olvido validar esto" });
//   }

//   // Limpiar Imagenes previas

//   if (modelo.img) {
//     // Borrar img del Servidor
//     const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
//     if (fs.existsSync(pathImg)) {
//       fs.unlinkSync(pathImg);
//     }
//   }

//   const nombre = await uploadFiles(req.files, undefined, coleccion);
//   modelo.img = nombre;

//   await modelo.save();

//   res.json(modelo);
// };

const updateImgCloudinary = async (req, res = response) => {
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

  // Limpiar Imagenes previas en Cloudinary
  if (modelo.img) {
    // Obtengo el public_id de la imagen
    // .../upload/v1640957325/qv5ng63wvloe0fnctbxx.jpg"
    const nombreArr = modelo.img.split("/");
    // [... "upload", "v1640957325", "qv5ng63wvloe0fnctbxx.jpg"]
    const nombreImg = nombreArr[nombreArr.length - 1];
    // "qv5ng63wvloe0fnctbxx.jpg"
    const [public_id] = nombreImg.split(".");
    // "qv5ng63wvloe0fnctbxx"

    cloudinary.uploader.destroy(public_id);
  }

  // Cargar img a cloudinary y base de datos
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
};

const getFile = async (req, res = response) => {
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

  // Obtenemos imagen
  if (modelo.img) {
    // Devolvemos imagen
    const pathImg = path.join(__dirname, "../uploads", modelo.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  // Si no hay imagen, devolvemos una imagen default
  if (!modelo.img) {
    const pathImgDefault = path.join(__dirname, "../assets/no-image.jpg");
    return res.sendFile(pathImgDefault);
  }

  // res.json({ msg: "falta placeholder" });
};

module.exports = { uploadFile, getFile, updateImgCloudinary };
