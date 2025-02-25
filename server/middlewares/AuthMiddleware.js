import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden - Invalid Token" });
      }
      
      req.user = { userId: decoded.userId, email: decoded.email }; // ✅ Attach user details to `req.user`
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
