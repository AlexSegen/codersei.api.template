class ResponseError extends Error{
    
    constructor({name, message, statusCode, code}) {
        super (message);
        this.name = name || "GenericError";
        this.statusCode = statusCode || 403
        this.code = code;
    }
}

module.exports = ResponseError;