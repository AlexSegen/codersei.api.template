function serviceResult(statusCode, data, message, error) {
    if (error instanceof Error) {
      return {
        statusCode,
        error,
        message: message || error.message,
      };
    }
  
    return {
      statusCode,
      data,
      message,
    };
  }

 module.exports = { serviceResult};