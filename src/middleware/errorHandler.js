const errorHandler = (err, req, res, _next) => {
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  console.error(err);
  return res.status(500).json({ message: 'Erro interno do servidor' });
};

module.exports = errorHandler;
