const ErrorHandler = (res, message, statusCode) => {
  res.status(statusCode).json({
    success: false,
    message: message,
  });
}

export default ErrorHandler;