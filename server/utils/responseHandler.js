
const successResponse = (res, statusCode = 200, data = {}, message = 'Success') => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

const errorResponse = (res, error, statusCode = 500, type = 'InternalError', message = 'Something went wrong') => {
    if(statusCode === 500)
        console.log(error.message || error);
    else
        console.log(type + ': ' + message);
    
    return res.status(statusCode).json({
        status: 'error',
        error: {
            code: statusCode,
            type,   // bad request, not found, internal error, etc.
            message
        }
    });
};

module.exports = { successResponse, errorResponse }