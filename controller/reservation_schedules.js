const express = require('express');
const reservationsSchedule = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const pengawasService = require('../repository/pengawas');
const koorService = require('../repository/koordinator')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const sendNotif = require('../utils/push_notification')
const date = require('../utils/date_format')
const notifService = require('../repository/notifications_conselour')
const notifMahasiswaService = require('../repository/notifications_students')
const uploadFile = require('../utils/supabase_storage')
const generateLink = require('../utils/link_image');
const conselorService = require('../repository/conselour')


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

  const data = await reservationsService.createReservation(nim, reservation_time, time_hours, description, type)
  if (!data) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save in database")
  }

  const reservation = await reservationsService.getReservationFromTimeAndNim(nim, reservation_time, time_hours)

  let title = "Permintaan Bimbingan Konseling Baru"
  let body = `${nim} membuat permintaan reservasi baru. Mohon untuk segera di proses`
  let notif = await notifService.createNotif(title, body, reservation.id, 0, 0)
  if (!notif) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when save notif")
  }

  const tokens = await pengawasService.getFcmToken()
  let tokensArr = tokens.map((e) => e.fcm_token)

  if (tokensArr.length > 0) {
    const isSuccess = await sendNotif.sendNotifToAll(title, body, tokensArr)
    if (!isSuccess) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
    }
  }

  return response.responseSuccess(res, StatusCodes.CREATED, null, "success save to database")
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
  console.log(id)
  let role = req.user.role
  console.log(role)
  if (role == 3) {
    var temp
    var konselor
    var data = await reservationsService.getById(id)
    if (!data) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }
    if (data.id_conselour) {
      if (data.model == 0) {
        konselor = await pengawasService.readById(data.id_conselour)
      } else if (data.model == 2) {
        konselor = await conselorService.searchById(data.id_conselour)
      }
    }
    var temp2 = data.dataValues
    temp = { ...temp2, konselor }
    if (temp == null) return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "error fetch data")
    return response.responseSuccess(res, StatusCodes.OK, temp, "success query data in database")
  } else if (role == 2) {
    const data = await reservationsService.getByIdAndProfile(id)
    if (!data) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "success query data in database")
  } else if (role == 0 || role == 1) {
    //Lengkap
    let data = await pengawasService.getAllStudentByIDWithStudentsAndPengawas(id)
    if (!data) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "success query data in database")
  }
  return response.responseSuccess(res, StatusCodes.BAD_REQUEST, null, "Bad request")
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
  let idConselour = req.user.id

  if (role == 1 || role == 3) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You unauthorized to edit data")
  }

  const reservasi = await reservationsService.getById(idData)

  if (reservasi.id_conselour != idConselour) {
    return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You unauthorized to edit data")
  }

  const { report } = req.body

  var file_report

  if (req.files) {
    file_report = req.files.file_report
  } else {
    file_report = null
  }

  console.log(report)
  var data

  console.log(file_report != null && report != null)


  if (file_report && report) {
    const up = uploadFile.uploadToSupabase(file_report)
    if (!up) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail upload file")
    }
    var link = generateLink.generateLink(file_report.name)

    data = await reservationsService.updateReport(idData, report)
    data = await reservationsService.updateFileReport(idData, link)
  }

  if (!file_report) {
    data = await reservationsService.updateReport(idData, report)
  }


  if (file_report) {
    const up = uploadFile.uploadToSupabase(file_report)
    if (!up) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail upload file")
    }
    var link = generateLink.generateLink(file_report.name)
    data = await reservationsService.updateFileReport(idData, link)
  }



  const students = await studentsService.getProfile(reservasi.nim)

  let fcm = students.fcm_token


  if (fcm) {
    const konselor = await conselorService.searchById(idConselour)
    console.log(fcm)
    let tanggal_reservasi = date.formatDate(reservasi.reservation_time)
    tanggal_reservasi = tanggal_reservasi + " " + reservasi.time_hours
    let title
    let body
    let titleNotifKoor
    let bodyNotifKoor
    
    title = `Laporan Akhir Bimbingan Konseling ${tanggal_reservasi}`;
    body = `Konselor telah selesai menulis laporan akhir sesi bimbingan konseling pada tanggal ${tanggal_reservasi}.`;
    titleNotifKoor = `Laporan Akhir Sesi Bimbingan Konseling ${students.nim} Telah Selesai`
    bodyNotifKoor = `Konselor ${konselor.name} telah selesai menulis laporan akhir sesi bimbingan konseling pada tanggal ${tanggal_reservasi}.`

    if (reservasi.file_report != null || reservasi.report != null) {
      title = `Perubahan Laporan Akhir Bimbingan Konseling ${tanggal_reservasi}`
      body = `Konselor melakukan perubahan pada laporan akhir sesi bimbingan konseling pada tanggal ${tanggal_reservasi}`
      titleNotifKoor = `Perubahan Laporan Akhir Sesi Bimbingan Konseling ${students.nim}`
      bodyNotifKoor = `Konselor ${konselor.name} melakukan perubahan pada laporan akhir sesi bimbingan konseling pada tanggal ${tanggal_reservasi}.`
    }

    if (role == 2) {
      const tokenKoor = await koorService.getFcmToken()
      console.log(tokenKoor)
      let tokensArr = tokenKoor.map((e) => e.fcm_token)
      let notifKoor = await notifService.createNotif(titleNotifKoor, bodyNotifKoor, idData, 1, 0)
      if (!notifKoor) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail create coordinator notif")
      }
      if (tokensArr.length > 0) {
        let sendNotifKoor = await sendNotif.sendNotifToAll(titleNotifKoor, bodyNotifKoor, tokensArr)
        if (!sendNotifKoor) {
          return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail send coordinator notif")
        }
      }
      const notifPengawas = await notifService.createNotif(titleNotifKoor, bodyNotifKoor, idData, 0, 0)
        if (!notifPengawas) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail save notif pengawas")
        }
    }

    const saveNotif = await notifMahasiswaService.createNotif(reservasi.nim, title, body, reservasi.id, reservasi.status)
    if (!saveNotif) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail save notif")
    }
    let isSuccess = await sendNotif.sendNotif(fcm, title, body)
    if (!isSuccess) {
      return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
    }
  }

  if (!data) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed update report")
  }

  return response.responseSuccess(res, StatusCodes.OK, null, "Success update report")
})


reservationsSchedule.put('/file-update/:id', jwt.validateToken, async (req, res) => {
  const { file_report } = req.files
  const id = req.params.id
  const reservasi = await reservationsService.getById(id)
  if (!reservasi) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail search reservation")
  }
  const mahasiswa = await studentsService.getProfile(reservasi.nim)
  const tokenKoor = await koorService.getFcmToken()
  console.log(tokenKoor)
  let tokensArr = tokenKoor.map((e) => e.fcm_token)
  const up = uploadFile.uploadToSupabase(file_report)
  if (!up) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail upload file")
  }
  var link = generateLink.generateLink(file_report.name)
  const updateRes = await reservationsService.updateFileReport(id, link)
  if (!updateRes) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail update file")
  }
  let titleNotifMhs = "Perubahan Laporan Akhir Sesi Bimbingan Konseling"
  let bodyNotifMhs = `Konselor melakukan perubahan pada laporan akhir sesi bimbingan konseling pada tanggal ${reservasi.reservation_time}.`
  let notifMahasiswa = await notifMahasiswaService.createNotif(mahasiswa.nim, titleNotifMhs, bodyNotifMhs, id, reservasi.status)
  let sendNotifMhs = await sendNotif.sendNotif(mahasiswa.fcm_token, titleNotifMhs, bodyNotifMhs)
  if (!notifMahasiswa && !sendNotifMhs) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail send notif")
  }
  let titleNotifKoor = `"Perubahan Laporan Akhir Sesi Bimbingan Konseling ${mahasiswa.nim}"`
  let bodyNotifKoor = `Konselor {nama_konselor} melakukan perubahan pada laporan akhir sesi bimbingan konseling pada tanggal ${reservasi.reservation_time}.`
  let notifKoor = await notifService.createNotif(titleNotifKoor, bodyNotifKoor, id, 1, 0)
  console.log(tokensArr)
  let sendNotifKoor = await sendNotif.sendNotifToAll(titleNotifKoor, bodyNotifKoor, tokensArr)
  if (!notifKoor && !sendNotifKoor) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail send notif")
  }
  return response.responseSuccess(res, StatusCodes.OK, null, "Success update report")
})

reservationsSchedule.get('/reservation-date/:date', jwt.validateToken, async (req, res) => {
  const date = req.params.date
  const data = await reservationsService.getReservationsByDate(date)
  if (!data) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
  }
  return response.responseSuccess(res, StatusCodes.OK, data, "Success query")
})

reservationsSchedule.delete('/:id', jwt.validateToken, async (req, res) => {
  const id = req.params.id
  const data = await reservationsService.deleteById(id)

  if (!data) {
    return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Delete reservation failed")
  }

  await notifService.deleteByResId(parseInt(id))

  await notifMahasiswaService.deleteByResId(parseInt(id))

  return response.responseSuccess(res, StatusCodes.OK, null, "Success delete reservation")
})

module.exports = {
  reservationsSchedule
}
