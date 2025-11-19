const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'task-manager-secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

const registerUser = async ({ name, email, password, passwordConfirmation }) => {
  if (!name || !email || !password || !passwordConfirmation) {
    throw new AppError('Todos os campos obrigatórios devem ser preenchidos.', 400);
  }

  const sanitizedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    throw new AppError('E-mail inválido.', 400);
  }

  const [localPart, domainPart] = sanitizedEmail.split('@');
  if (!localPart || !domainPart) {
    throw new AppError('E-mail inválido.', 400);
  }

  if (localPart.includes('..') || domainPart.includes('..')) {
    throw new AppError('E-mail inválido.', 400);
  }

  const domainLabels = domainPart.split('.');
  if (domainLabels.some((label) => label.length === 0)) {
    throw new AppError('E-mail inválido.', 400);
  }

  const existing = userModel.findUserByEmail(sanitizedEmail);
  if (existing) {
    throw new AppError('E-mail já cadastrado.', 409);
  }

  if (password !== passwordConfirmation) {
    throw new AppError('As senhas informadas não conferem.', 400);
  }

  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    throw new AppError('A senha deve possuir no mínimo 8 caracteres contendo letras e números.', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuid(),
    name,
    email: sanitizedEmail,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  userModel.createUser(user);
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

const authenticateUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios.', 400);
  }

  const user = userModel.findUserByEmail(email);
  if (!user) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRATION
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

module.exports = {
  registerUser,
  authenticateUser
};
