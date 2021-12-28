const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatorio"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"],
    default: "USER_ROLE",
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// Para eliminar password de la BD
UsuarioSchema.method("toJSON", function () {
  // saco __v y password, y el resto de las props las almaceno en usuario
  const { __v, password, _id, ...usuario } = this.toObject();
  // Cambio el nombre visual de _id por uid en la bd
  usuario.uid = _id;
  return usuario;
});

module.exports = model("Usuario", UsuarioSchema);
