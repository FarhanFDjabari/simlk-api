function responseSuccess(res,statusCode, data, message) {
    return res.status(statusCode).json({
        status_code : statusCode,
        status: true,
        data,
        message: message
    });
}

function responseFailure(res, statusCode, data, message) {
    return res.status(statusCode).json({
        status_code : statusCode,
        status: false,
        data: data,
        message: message
    });
}

module.exports = {
    responseSuccess,
    responseFailure,
}
