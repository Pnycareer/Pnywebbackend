// utils/jwtUtil.js
import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, name, role, res) => {
  const token = jwt.sign(
    { id: userId, userName: name, role: role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  return token;
};

export { generateTokenAndSetCookie };
