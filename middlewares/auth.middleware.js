import jwt from "jsonwebtoken";

async function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        data: null,
      });
    }

    console.log("Error verifying token:", error);
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
      data: null,
    });
  }
}

export default verifyToken;
