const express = require('express');
const pengawasController = express.Router()
const response = require('../utils/response')
const pengawasService = require('../repository/pengawas')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const notifService = require('../repository/notifications_conselour')
const koorService = require('../repository/koordinator')
const { dynamicSort } = require('../utils/sorting')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes');
const sendNotif = require('../utils/push_notification')
const { uploadToSupabase, generateLink } = require('../utils/supabase_storage');


// get profile
pengawasController.get('/profile', jwt.validateToken, async (req, res) => {
  let id = req.user.id
  let data = await pengawasService.readById(id)
  if (!data) {
    let error = "Error query database"
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, error)
  }
  let dataValues = data
  return response.responseSuccess(res, StatusCodes.OK, dataValues, "Success Query")
})

// get reservation mahasiswa (all)
pengawasController.get('/reservation-uncompleted', jwt.validateToken, async (req, res) => {
  let role = req.user.role
  if (role != 0) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
  }
  let result = await pengawasService.getAllStudentByNimWithReservationWithStudentsAndConseolour()
  let resultTwo = await pengawasService.getAllStudentByNimWithReservationWithStudentsAndPengawas()
  if (!result || !resultTwo) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
  }
  Array.prototype.push.apply(result, resultTwo)

  result.sort(dynamicSort("id"))
  return response.responseSuccess(res, StatusCodes.OK, result, "Success Query")
})

// get history
pengawasController.get('/reservation-completed', jwt.validateToken, async (req, res) => {
  let role = req.user.role
  if (role != 0) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
  }
  // let result = await pengawasService.getAllStudentByNimWithHistoryWithStudentsAndConseolour()
  let resultTwo = await pengawasService.getAllStudentByNimWithHistoryWithStudentsAndPengawas()
  if (!resultTwo) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
  }
  // Array.prototype.push.apply(result, resultTwo)
  // result.sort(dynamicSort("id"))
  // console.log(result)
  // console.log(resultTwo)
  return response.responseSuccess(res, StatusCodes.OK, resultTwo, "Success Query")
})

// assign to coordinator
pengawasController.get('/approved/:id', jwt.validateToken, async (req, res) => {
  let role = req.user.role
  if (role != 0) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
  }
  let idRes = req.params.id
  let data = await pengawasService.toCoordinator(idRes)
  if (data.error) {
    if (!data) {
      let error = data.error
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
  }

  let title = `Permintaan Bimbingan Konseling Baru ${nim_mahasiswa}`
  let body = "Terdapat permintaan bimbingan konseling baru yang diserahkan oleh konselor ahli"
  let notif = await notifService.createNotif(title, body, reservation.id, 1, 0)
  if (!notif) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when save notif")
  }

  const tokens = await koorService.getFcmToken()
  const tokenArr = Object.values(token)
  const isSuccess = await sendNotif.sendNotifToAll(title, body, tokenArr)


  let title2 = "Konselor Ditugaskan"
  let body2 = `Sistem telah menugaskan konselor kepada kamu. Mohon tunggu update lokasi pertemuan`
  let notif2 = await notifServiceMahasiswa.createNotif(reservasi.nim, title, body, idRes)
  if (!notif2) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save database")
  }

  let reservasi = await reservationsService.getById(idRes)
  let mahasiswa = await studentsService.getProfile(reservasi.nim)

  const token = mahasiswa.fcm_token
  const isSuccess2 = await sendNotif.sendNotif(token, title2, body2)


  if (!isSuccess || !isSuccess2) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
  }
  let dataValues = data.data
  return response.responseSuccess(res, StatusCodes.OK, null, "Success Query")
})


// take by pengawas
pengawasController.get('/take/:id', jwt.validateToken, async (req, res) => {
  let role = req.user.role
  let idUser = req.user.id
  if (role != 0) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
  }
  let idRes = req.params.id
  let data = await pengawasService.takeByPengawas(idRes, idUser)
  if (data.error) {
    if (!data) {
      let error = data.error
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
  }
  let dataValues = data.data
  return response.responseSuccess(res, StatusCodes.OK, null, "Success take data")
})

// update by pengawas
pengawasController.get('/update', jwt.validateToken, async (req, res) => {
  const { status, id, location } = req.query
  let role = req.user.role
  let idConselour = req.user.id
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

  console.log(reservation)

  const mahasiswa = await studentsService.getProfile(reservation.nim)

  return response.responseSuccess(res, StatusCodes.OK, null, "Success update status")
})

pengawasController.get('/notapproved', jwt.validateToken, async (req, res) => {
  let role = req.user.role
  if (role != 0) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
  }
  let data = await pengawasService.getAllStudentNotApproved()
  if (!data) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
  }
  return response.responseSuccess(res, StatusCodes.OK, data, "Success")
})

pengawasController.put('/profile', jwt.validateToken, async (req, res) => {
  let { name } = req.body
  let id = req.user.id
  let pengawas = await pengawasService.readById(id)
  if (req.files) {
    const { avatar } = req.files
    let nameFile = `${id}${avatar.name}`
    avatar.name = nameFile
    let link = generateLink(avatar.name)
    let status = await uploadToSupabase(avatar)
    if (!status) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when upload image")
    }
    let data = pengawasService.update(id, link, pengawas.fcm_token, name)
    if (!data) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success")
  } else {
    let data = pengawasService.update(id, pengawas.profile_image_url, pengawas.fcm_token, name)
    return response.responseSuccess(res, StatusCodes.OK, data, "Success")
  }
})



module.exports = {
  pengawasController
}
