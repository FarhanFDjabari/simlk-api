const express = require('express');
const reservationsSchedule = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')




reservationsSchedule.post('/', jwt.validateToken, async (req, res) => {
    const nim = req.user.id

    const {reservation_time, time_hours, description} = req.body

    const data = reservationsService.createReservation(nim,reservation_time, time_hours, description)

    if (!data){
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed save in database")
    }

    return response.responseSuccess(res, StatusCodes.CREATED, data, "success save to database" )
})

reservationsSchedule.get('/',jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if(role==1){
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "You are not allowed to see this")
    }

    const data = await reservationsService.paginate()

    if (!data){
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed query in database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "success query databas" )
})


module.exports = {
    reservationsSchedule
}
