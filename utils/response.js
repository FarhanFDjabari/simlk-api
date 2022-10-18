function responseSuccess(res,statusCode, data, message) {
    return res.status(statusCode).json({
        status_code : statusCode,
        status: true,
        data : data,
        message: message
    });
}

function responseFailure(res, statusCode, message) {
    return res.status(statusCode).json({
        status_code : statusCode,
        status: false,
        data: null,
        message: message
    });
}

module.exports = {
    responseSuccess,
    responseFailure,
}
