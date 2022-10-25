const express = require('express');
const reservationsStudent = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')


reservationsStudent.get('/', jwt.validateToken, async (req, res) => {
    const nim = req.user.id
    const data = await reservationsService.finishByNim(nim)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success query")
})

reservationsStudent.get('/reservations', jwt.validateToken, async (req, res) => {
    const nim = req.user.id
    const data = await studentsService.searchStudentByNimWithReservations(nim)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success query")
})

reservationsStudent.get('/reservation-date/:date', jwt.validateToken, async (req, res) => {
    const date = req.params.date
    const data = await reservationsService.getReservationsByDate(date)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success query")
})






module.exports = {
    reservationsStudent
}
