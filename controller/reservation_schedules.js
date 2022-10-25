const express = require('express');
const reservationsSchedule = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')
const notifService = require('../repository/notifications_conselour')

reservationsSchedule.post('/', jwt.validateToken, async (req, res) => {
    const nim = req.user.id

    const { reservation_time, time_hours, description, type } = req.body

    const dataIsExist = await reservationsService.getReservationsByDate(reservation_time)

    if (dataIsExist.length != 0) {
        for (i = 0; i < dataIsExist.length; i++) {
            if (dataIsExist[i].time_hours == time_hours) return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Failed save in database because already booked")
        }
    }

    console.log(dataIsExist)

    const data = reservationsService.createReservation(nim, reservation_time, time_hours, description, type)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save in database")
    }

    let title = "Permintaan Bimbingan Konseling Baru"
    let body = `${nim} membuat permintaan reservasi baru. Mohon untuk segera di proses`
    let notif = await notifService.createNotif(title, body, JSON.stringify(data))

    if (!notif) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when save notif")
    }
    const isSuccess = await sendNotif.sendNotifToAll(title, body, data)

    if (!isSuccess) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
    }

    console.log(isSuccess)

    return response.responseSuccess(res, StatusCodes.CREATED, data, "success save to database")
})

//Ambil buat kalender
reservationsSchedule.get('/', jwt.validateToken, async (req, res) => {
    const data = await reservationsService.reservationSchedule()
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "success query database")
})

reservationsSchedule.get('/:id', jwt.validateToken, async (req, res) => {
    let id = req.params.id

    const data = await reservationsService.getById(id)

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "success query in database")
})

reservationsSchedule.delete('/:id', jwt.validateToken, async (req, res) => {
    let id = req.params.id
    let role = req.user.role

    if (role == 1) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You unauthorized to delete data")
    }
    const data = await reservationsService.deleteById(id)

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "success delete data in database")
})

reservationsSchedule.put('/:id', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    let idData = req.params.id

    if (role == 1) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You unauthorized to delete data")
    }

    const { report } = req.body

    const data = await reservationsService.updateReport(idData, report)

    const reservation = await reservationsService.getById(idData)

    let fcm = reservation.fcm_token

    if (fcm) {
        let isSuccess = await sendNotif.sendNotif(fcm, "Laporan Anda Diberikan", "body", "data")
        if (!isSuccess) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
        }
    }

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update report")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "Success update report")
})


reservationsSchedule.get('/reservation-date/:date', jwt.validateToken, async (req, res) => {
    const date = req.params.date
    const data = await reservationsService.getReservationsByDate(date)
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success query")
})

module.exports = {
    reservationsSchedule
}
