import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // You now have access to user id and role in `req.user`
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;

export const checkAuth = (req, res, next) => {
  // Typically the token is sent in Authorization header as 'Bearer <token>'
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info to request
    next();
  }
  catch (err) {
    // Handle token expiration differently
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired",
        code: "TOKEN_EXPIRED" // Frontend can use this to trigger refresh
      });
    }
    return res.status(401).json({ message: "Token is invalid" });
  }
};
