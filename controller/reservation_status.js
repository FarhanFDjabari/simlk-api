const express = require('express');
const reservationsStatus = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')

reservationsStatus.get('/', jwt.validateToken, async (req, res) => {
    const { status, id } = req.query
    if (!status || !id ){
        return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Failure, need query arguments")
    }
    const data = await reservationsService.updateStatus(id, status)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update status")
    }

    const reservation = await reservationsService.getById(id)

    let fcm = reservation.fcm_token

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
