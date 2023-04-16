class CustomError extends Error {
    constructor(resCode, message) {
        super();
        this.code = resCode.code;
        this.httpStatusCode = resCode.httpCode;
        this.message = message || resCode.message
    }
    // constructor(code =200, httpStatusCode = 200, message) {
    //     super(message);
    //     this.code = code;
    //     this.httpStatusCode = httpStatusCode;
    // }
}


module.exports = CustomError;