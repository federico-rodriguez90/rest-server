const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

// Para eliminar password de la BD
CategorySchema.method("toJSON", function () {
  // saco __v, estado y el resto de las props las almaceno en data
  const { __v, estado, ...data } = this.toObject();
  return data;
});

module.exports = model("Category", CategorySchema);
