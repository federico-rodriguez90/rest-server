const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  descripcion: { type: String },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  precio: { type: Number, default: 0 },
  disponible: { type: Boolean, default: true },
  img: { type: String },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// Para eliminar password de la BD
ProductSchema.method("toJSON", function () {
  // saco __v, estado y el resto de las props las almaceno en data
  const { __v, estado, ...data } = this.toObject();
  return data;
});

module.exports = model("Product", ProductSchema);
