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

    if (userRole != 3 && userRole != 2) {
        //admin
        data = await notificationConselour.getAllNotif(userRole)

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    } else if (userRole == 3) {
        //mahasiswa
        data = await notificationStudent.getAllNotif(id)

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    } else {
      // konselor
      data = await notificationConselour.getAllNotifForId(id, 2)

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

    if (userRole != 3 && userRole != 2) {
        //admin
        data = await notificationConselour.getById(idNotif, userRole)

        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure query database")
        }
    } else if (userRole == 3) {
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
    let userId = req.user.id
    let idNotif = req.params.id
    const { is_read } = req.body
    var data
    if (userRole != 3 && userRole != 2) {
        data = await notificationConselour.updateIsReadAllCounselor(idNotif, is_read)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    } else if (userRole == 3) {
        data = await notificationStudent.updateIsRead(idNotif, is_read)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    } else {
      data = await notificationConselour.updateIsRead(idNotif, is_read, 2, userId)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    }
    return response.responseSuccess(res, StatusCodes.OK, null, "Success update database")
})

notifications.put('/', jwt.validateToken, async (req, res) => {
    let userRole = req.user.role
    let id = req.user.id
    var data
    if (userRole != 3 && userRole != 2) {
        data = await notificationConselour.markAllRead(userRole)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    } else if (userRole == 3) {
        data = await notificationStudent.markAllRead(id)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
        }
    } else if (userRole == 2){
        data = await notificationConselour.markAllRead(2, id)
        if (!data) {
          return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failure update database")
      }
    }
    return response.responseSuccess(res, StatusCodes.OK, null, "Success update database")
})




module.exports = {
    notifications
}


