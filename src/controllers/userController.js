const userService = require('../services/userService');

const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.authenticateUser(req.body);
    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login
};
