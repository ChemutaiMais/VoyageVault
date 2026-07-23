import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization token missing",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        error: "Token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Session expired. Please log in again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token.",
      });
    }

    console.error(err);

    return res.status(500).json({
      error: "Authentication failed.",
    });
  }
};

export default auth;