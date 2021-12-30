const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadFiles = (
  files,
  extensionesValidas = ["png", "jpg", "gif", "jpeg"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extensionFile = nombreCortado[nombreCortado.length - 1];

    //Extension permitidas
    if (!extensionesValidas.includes(extensionFile)) {
      return reject(
        `La extension ${extensionFile} no es valida. Permitidas: ${extensionesValidas.join(
          ", "
        )}`
      );
    }

    //Cambio de nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionFile}`;

    //Uso path.join() para establecer la ruta de la carpeta /uploads
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      carpeta,
      nombreArchivo
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreArchivo);
    });
  });
};

module.exports = { uploadFiles };
