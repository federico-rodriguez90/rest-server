const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Se conecto a la base de datos");
  } catch (error) {
    console.log("Error connecting to database");
  }
};

module.exports = { dbConnection };
