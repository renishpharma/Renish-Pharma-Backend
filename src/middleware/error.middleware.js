const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export default errorHandler;