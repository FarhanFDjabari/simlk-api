const express = require('express');
const notifications = express.Router()
const response = require('../utils/response')
const notificationStudent = require('../repository/notifications_students')
const notificationConselour = require('../repository/notifications_conselour')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

notifications.get('/', jwt.validateToken, async (req, res) => {
    let userRole = req.user.role
    let id = req.user.id
    var data

    if (userRole == 0) {
        //admin
        data = await notificationConselour.getAllNotif()

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    } else if (userRole == 1) {
        //mahasiswa
        data = await notificationStudent.getAllNotif(id)

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success query database")
})

notifications.get('/:id', jwt.validateToken, async (req, res) => {
    let userRole = req.user.role
    let idNotif = req.params.id
    var data

    if (userRole == 0) {
        //admin
        data = await notificationConselour.getById(idNotif)

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    } else if (userRole == 1) {
        //mahasiswa
        data = await notificationStudent.getById(idNotif)

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success query database")
})

notifications.post('/:id', jwt.validateToken, async (req, res) => {
    let userRole = req.user.role
    let idNotif = req.params.id
    const { is_read } = req.body
    var data
    if (userRole == 0) {
        data = await notificationConselour.updateIsRead(idNotif, is_read)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    } else {
        data = await notificationStudent.updateIsRead(idNotif, is_read)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    }
    return response.responseSuccess(res, StatusCodes.OK, null, "Success update database")
})

notifications.put('/', jwt.validateToken, async (req, res) => {
    let userRole = req.user.role
    var data
    if (userRole == 0) {
        data = await notificationConselour.markAllRead()
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    } else {
        data = await notificationStudent.markAllRead()
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    }
    return response.responseSuccess(res, StatusCodes.OK, null, "Success update database")
})



module.exports = {
    notifications
}


