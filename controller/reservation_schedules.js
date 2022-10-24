const express = require('express');
const reservationsSchedule = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')
const conseloursService = require('../repository/conselour')

reservationsSchedule.post('/', jwt.validateToken, async (req, res) => {
    const nim = req.user.id

    const { reservation_time, time_hours, description } = req.body

    const data = reservationsService.createReservation(nim, reservation_time, time_hours, description)

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save in database")
    }


    const isSuccess = await sendNotif.sendNotifToAll("Mahasiswa Membuat Reservasi", "body", "data")
    if (!isSuccess){
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
    }

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

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update report")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "Success update report")
})

module.exports = {
    reservationsSchedule
}
