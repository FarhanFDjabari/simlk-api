const express = require('express');
const reservationsStatus = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const notifService = require('../repository/notifications_students')
const jwt = require('../middleware/jwt_auth')
const date = require('../utils/date_format')

const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')

reservationsStatus.get('/', jwt.validateToken, async (req, res) => {
    const { status, id, location } = req.query
    let idConselour = req.user.id
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
    let tanggal_reservasi = date.formatDate(reservation.reservation_time)
    tanggal_reservasi = tanggal_reservasi + " " + reservation.time_hours
    let title, body
    if (reservation.status == 4) {
        const setCounselor = await reservationsService.setKonselor(idConselour, id)
        if (!setCounselor) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed set conselour")
        }
        title = "Permintaan Bimbingan Konseling Kamu Telah Dijadwalkan"
        body = "Konselor telah selesai memproses permintaan bimbingan konselingmu."
    } else if (reservation.status == 5) {
        if (idConselour != reservation.id_conselour) {
            return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You are not allowed to use this endpoint")
        }
        title = "Permintaan Bimbingan Konseling Kamu Dalam Penanganan"
        body = "Mohon untuk menunggu sebentar, konselor akan menghubungi ke informasi kontak yang tersedia."
    } else if (reservation.status == 6) {
        title = "Bimbingan Konseling Telah Selesai"
        body = `Bimbingan konseling pada tanggal ${tanggal_reservasi} telah selesai. Konselor sedang dalam proses menulis laporan akhir`

        // var konselor = await konsService.searchById(reservation.id_conselour)
        // title2 = `Laporan Akhir Sesi Bimbingan Konseling ${reservation.nim} Telah Selesai`
        // body2 = `Konselor ${konselor.name} telah selesai menulis laporan akhir sesi bimbingan konseling pada tanggal ${tanggal_reservasi}.`
        // var tokens = await pengawasService.getFcmToken()
        // let tokensArr = tokens.map((e) => e.fcm_token)

        // const saveNotif2 = await notifPengawasService.createNotif(title2, body2, reservation.id, 0, 0)
        // if (!saveNotif2) {
        //     return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail save notif")
        // }

        // if (tokensArr.length > 0) {
        //     let isSuccess = await sendNotif.sendNotifToAll(title2, body2, tokensArr)
        //     if (!isSuccess) {
        //         return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
        //     }
        // }

    }
    const saveNotif = await notifService.createNotif(reservation.nim, title, body, id, reservation.status)
    if (!saveNotif) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail save notif")
    }
    if (fcm) {
        let isSuccess = await sendNotif.sendNotif(fcm, title, body)
        if (!isSuccess) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
        }
    }

    return response.responseSuccess(res, StatusCodes.OK, null, "Success update status")
})

module.exports = {
    reservationsStatus
}
