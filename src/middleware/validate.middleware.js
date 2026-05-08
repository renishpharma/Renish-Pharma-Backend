const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    console.error("Validation Error:", error);
    const message = error.errors?.[0]?.message || error.message || "Validation failed";
    return res.status(400).json({
      success: false,
      message
    });
  }
};

export default validate;