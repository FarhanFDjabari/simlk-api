const express = require('express');
const reservationsStatus = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')

reservationsStatus.get('/', jwt.validateToken, async (req, res) => {
    const { status, id, location } = req.query
    let role = req.user.role
    if (role != 0) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You are not allowed to use this endpoint")
    }
    if (!status && !id && !location) {
        return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Failure, need query arguments")
    }
    var data
    if (status){
        data = await reservationsService.updateStatus(id, status)
    }
    if (location){
        data = await reservationsService.updateLocation(id, location)
    }

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update status")
    }

    const reservation = await reservationsService.getById(id)

    const mahasiswa = await studentsService.getProfile(reservation.nim)

    let fcm = mahasiswa.fcm_token

    if (fcm) {
        let isSuccess = await sendNotif.sendNotif(fcm, "Status Anda Diupdate", "body", "data")
        if (!isSuccess) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
        }
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "Success update status")
})

module.exports = {
    reservationsStatus
}
