// middleware/checkRole.js
export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};



export const checkPublicToken = (req, res, next) => {
 
  const token = req.headers['authorization'];
  if (!token || token !== `Bearer ${process.env.PUBLIC_ACCESS_TOKEN}`) {
    return res.status(403).json({ message: "Access denied: Invalid token" });
  }

  next();
};






