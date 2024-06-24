const asyncHandler = (fn) => async (req, res, next) => {
  try {
    
    await fn(req, res, next);
  } catch (error) {
    const statusCode = error.code || 500;
    const errorMessage = error.message;

    res.status(statusCode).json({ success: false, message: errorMessage });
  }
};

export { asyncHandler };
