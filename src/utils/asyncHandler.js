const asyncHandler = (fn) => async (req, res, next) => {
  try {
    // Execute the asynchronous function 'fn' with the provided parameters
    await fn(req, res, next);
  } catch (error) {
    // If an error occurs during the execution of 'fn', handle it here
    const statusCode = error.code || 500; // Determine the HTTP status code
    const errorMessage = error.message; // Extract the error message

    // Send a JSON response indicating failure with the error details
    res.status(statusCode).json({ success: false, message: errorMessage });
  }
};

// Export the asyncHandler function to be used elsewhere in the application
export { asyncHandler };
