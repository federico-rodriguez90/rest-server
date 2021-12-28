const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar el token primero",
    });
  }

  const { role, nombre } = req.usuario;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `El usuario ${nombre} no es administrador`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    // console.log(roles, req.usuario.role);
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
    }

    const { role } = req.usuario;
    if (!roles.includes(role)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = { isAdminRole, hasRole };
