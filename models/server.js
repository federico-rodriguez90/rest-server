const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
      search: "/api/search",
      products: "/api/products",
    };

    //Conectar a la base de datos
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));

    //Fileupload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
    this.app.use(this.paths.products, require("../routes/products"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}!`);
    });
  }
}

module.exports = Server;
