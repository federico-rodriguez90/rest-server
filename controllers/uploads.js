const { response } = require("express");

const { uploadFiles } = require("../helpers");

const uploadFile = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: "No hay archivos que subir." });
    return;
  }

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

module.exports = { uploadFile };
