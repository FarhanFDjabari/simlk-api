const express = require('express');
const reservationsHistory = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

reservationsHistory.get('/', jwt.validateToken, async (req, res) => {
    const data = await studentsService.getAllStudent()
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "success query database")
})

reservationsHistory.get('/:nim', jwt.validateToken, async (req, res) => {
    let nim = req.params.nim
    const data = await reservationsService.getByNim(nim)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "success query database")
})




module.exports = {
    reservationsHistory
}
