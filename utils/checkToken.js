const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const token = extractTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({
      mensagem: "Acesso negado!"
    });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(400).json({
      mensagem: "O Token é inválido!"
    });
  }
}

function extractTokenFromHeader(req) {
  const authHeader = req.headers["authorization"];
  return authHeader && authHeader.split(" ")[1];
}

module.exports = checkToken;