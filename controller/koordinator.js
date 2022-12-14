const express = require('express');
const koordinatorController = express.Router()
const response = require('../utils/response')
const koordinatorService = require('../repository/koordinator')
const conseloursService = require('../repository/conselour')
const mahasiswaService = require('../repository/students')
const reservasiService = require('../repository/reservations')
const jwt = require('../middleware/jwt_auth')
const notifService = require('../repository/notifications_conselour')
const notifServiceMahasiswa = require('../repository/notifications_students')
const sendNotif = require('../utils/push_notification')
const { StatusCodes } = require('http-status-codes')
const { uploadToSupabase, generateLink } = require('../utils/supabase_storage');

koordinatorController.get('/profile', jwt.validateToken, async (req, res) => {
    let id = req.user.id
    var result = await koordinatorService.readById(id)
    if (result.error) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, result.error)
    }
    return response.responseSuccess(res, StatusCodes.OK, result.data, "Success Query")
})

// Menjadwalkan konselor ke reservasi
koordinatorController.get('/reservation/:idres/konselor/:idkon', jwt.validateToken, async (req, res) => {
    let idRes = req.params.idres
    let idKon = req.params.idkon
    let role = req.user.role
    if (role != 1) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    var result = await koordinatorService.selectKonselor(idRes, idKon, 3)
    if (result.error) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, result.error)
    }
    let data = result.data

    let reservasi = await reservasiService.getById(idRes)

    let title = "Konselor Ditugaskan"
    let body = `Sistem telah menugaskan konselor kepada kamu. Mohon tunggu update lokasi pertemuan`
    let notif = await notifServiceMahasiswa.createNotif(reservasi.nim, title, body, idRes)
    if (!notif) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save database")
    }

    let mahasiswa = await mahasiswaService.getProfile(reservasi.nim)

    const token = mahasiswa.fcm_token
    const isSuccess = await sendNotif.sendNotif(token, title, body)

    var title2 = "Permintaan Bimbingan Konseling Baru"
    var body2 = "Terdapat permintaan bimbingan konseling baru yang ditugaskan kepada kamu"
    let notif2 = await notifService.createNotif(title2, body2, idRes, 2, idKon)
    let konselor = await conseloursService.searchById(idKon)
    if (!notif2) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save database")
    }
    const isSuccess2 = await sendNotif.sendNotif(konselor.fcm_token, title, body)

    if (!isSuccess || !isSuccess2){
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when save notif")
    }
    return response.responseSuccess(res, StatusCodes.OK, { data }, "Success Update")
})

// Melihat reservasi yang diajukan
koordinatorController.get('/reservasi-diajukan', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if (role != 1) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    let result = await koordinatorService.findAllResAssign(2)
    console.log(result)
    if (result.error) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, result.error)
    }
    if (!result.data) {
        let data = result.data
        return response.responseSuccess(res, StatusCodes.OK, { data }, "Success Query")
    }
    return response.responseSuccess(res, StatusCodes.OK, result.data, "Success Query")
})

// Melihat konselor yang tersedia
koordinatorController.get('/conselor-tersedia/reservasi/:idres', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if (role != 1) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    let idRes = req.params.idres
    let result = await koordinatorService.getConselorPadaTanggalReservasi(idRes)
    if (result.error) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, result.error)
    }
    return response.responseSuccess(res, StatusCodes.OK, result.data, "Success Query")
})

//Mengisi jadwal ke konselor
koordinatorController.put('/jadwal/konselor', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if (role != 1) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    const { jadwal, id_konselor } = req.body
    let result = await conseloursService.updateJadwal(id_konselor, jadwal)

    if (!result) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database")
    }

    result = null
    return response.responseSuccess(res, StatusCodes.OK, null, "Success update data from database")
})


//Lengkapi profile
koordinatorController.put('/profile', jwt.validateToken, async (req, res) => {
    const id = req.user.id
    const koorData = await koordinatorService.readById(id)
    const { nim, name } = req.body

    if (!req.files) {
        const updatedData = await koordinatorService.updateProfile(id, nim, name, koorData.profile_image_url)
        if (!updatedData) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success update profile")
    } else {
        const { avatar } = req.files
        let nameFile = `${nim}${avatar.name}`
        avatar.name = nameFile
        let link = generateLink(avatar.name)
        let status = await uploadToSupabase(avatar)
        if (!status) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when upload image")
        }
        const updatedData = await koordinatorService.updateProfile(id, nim, name, link)
        if (!updatedData) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success update profile")
    }
})


module.exports = {
    koordinatorController
}
