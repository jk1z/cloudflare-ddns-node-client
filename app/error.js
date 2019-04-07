
exports.error = (errorCode, errorMessage) => {
  const error = new Error(errorMessage);
  error.code = errorCode;
  return error;
};