// Custom errors with code and message parameters
function throwError(code, message) {
  var err = new Error(message);
  err.status = code;
  throw err;
}

// Create custom success string
function message(message) {
  return {
    code:  200,
    message: message
  };
}

module.exports = { throwError, message };
