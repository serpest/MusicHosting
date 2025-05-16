const jwt = require('jsonwebtoken');

const DEFAULT_JWT_SECRET = 'bK;]:2LCNA6Eju:R';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

const signToken = (id, email) => {
  return jwt.sign({id: id, email: email}, JWT_SECRET, { expiresIn: '1d' });
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  signToken,
  authenticateToken
};
