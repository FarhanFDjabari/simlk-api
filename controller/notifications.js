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


