const express = require('express');
const pengawasController = express.Router()
const response = require('../utils/response')
const pengawasService = require('../repository/pengawas')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const notifService = require('../repository/notifications_students')
const { dynamicSort } = require('../utils/sorting')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes');

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
    let result = await pengawasService.getAllStudentByNimWithHistoryWithStudentsAndConseolour()
    let resultTwo = await pengawasService.getAllStudentByNimWithHistoryWithStudentsAndPengawas()
    if (!result && !resultTwo) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
    }
    Array.prototype.push.apply(result, resultTwo)
    result.sort(dynamicSort("id"))
    console.log(result)
    console.log(resultTwo)
    return response.responseSuccess(res, StatusCodes.OK, result, "Success Query")
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
    let dataValues = data.data
    return response.responseSuccess(res, StatusCodes.OK, { dataValues }, "Success Query")
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
    return response.responseSuccess(res, StatusCodes.OK, { dataValues }, "Success take data")
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

    // let fcm = mahasiswa.fcm_token
    // let title, body
    // if (reservation.status == 2) {
    // } else if (reservation.status == 3) {
    // }
    // const saveNotif = await notifService.createNotif(reservation.nim, title, body, reservation.id, reservation.status)
    // if (!saveNotif) {
    //     return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail save notif")
    // }
    // if (fcm) {

    //     let isSuccess = await sendNotif.sendNotif(fcm, title, body)
    //     if (!isSuccess) {
    //         return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Sucess save in database but fail when send notif")
    //     }
    // }

    return response.responseSuccess(res, StatusCodes.OK, null, "Success update status")
})




module.exports = {
    pengawasController
}
