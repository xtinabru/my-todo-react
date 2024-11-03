import jwt from 'jsonwebtoken';

const authorizationRequired = 'Authorization required';
const invalidCredentials = 'Invalid credentials';

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
      res.statusMessage = authorizationRequired;
      return res.status(401).json({ message: authorizationRequired });
  } else {
      try {
          const token = req.headers.authorization.split(' ')[1]; 
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = { id: decoded.id }; // Добавляем userId в req
          next();
      } catch (err) {
          res.statusMessage = invalidCredentials;
          return res.status(403).json({ message: invalidCredentials });
      }
  }
};


export default auth;
