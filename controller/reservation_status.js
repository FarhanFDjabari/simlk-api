const express = require('express');
const reservationsStatus = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const notifService = require('../repository/notifications_students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')
const date = require('../utils/date_format')

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
    if (status) {
        data = await reservationsService.updateStatus(id, status)
    }
    if (location) {
        data = await reservationsService.updateLocation(id, location)
    }

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update status")
    }

    const reservation = await reservationsService.getById(id)

    const mahasiswa = await studentsService.getProfile(reservation.nim)

    let fcm = mahasiswa.fcm_token
    let title, body
    if (reservation.status == 2) {
        title = "Permintaan Bimbingan Konseling Kamu Sedang Dalam Proses"
        body = "Konselor sedang memproses permintaan bimbingan konselingmu"
    } else if (reservation.status == 3) {
        title = "Permintaan Bimbingan Konseling Kamu Dalam Penanganan"
        body = "Konselor telah selesai memproses permintaan bimbingan konselingmu. Silahkan cek informasi lebih detail."
    } else if (reservation.status == 4) {
        let tanggal_reservasi = date.formatDate(reservation.reservation_time)
        title = "Bimbingan Konseling Telah Selesai"
        body = `Bimbingan konseling pada tanggal ${tanggal_reservasi} telah selesai. Konselor sedang dalam proses menulis laporan akhir`
    }
    const saveNotif = await notifService.createNotif(reservation.nim, title, body, JSON.stringify(reservation))
    if (!saveNotif) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail save notif")
    }
    if (fcm) {

        let isSuccess = await sendNotif.sendNotif(fcm, title, body, reservation)
        if (!isSuccess) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
        }
    }

    return response.responseSuccess(res, StatusCodes.OK, null, "Success update status")
})

module.exports = {
    reservationsStatus
}
