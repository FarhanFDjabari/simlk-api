const express = require('express');
const reservationsStatus = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

reservationsStatus.get('/', jwt.validateToken, async (req, res) => {
    const { status, id } = req.query
    if (!status || !id ){
        return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Failure, need query arguments")
    }
    const data = await reservationsService.updateStatus(id, status)

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update status")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "Success update status")
})

module.exports = {
    reservationsStatus
}
