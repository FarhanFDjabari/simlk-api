const express = require('express');
const pengawasController = express.Router()
const response = require('../utils/response')
const pengawasService = require('../repository/pengawas')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

// get profile
pengawasController.get('/profile', jwt.validateToken, async (req, res) => {
    let id = req.user.id
    let data = await pengawasService.readById(id)
    if (data.error) {
        let error = data.error
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
    let dataValues = data.data
    return response.responseSuccess(res, StatusCodes.OK, dataValues)
})

// get reservation mahasiswa (all)
pengawasController.get('/reservation-uncompleted', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if (role != 0) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    let result = await pengawasService.getAllStudentByNimWithReservationWithStudentsAndConseolour()
    if (!result) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
    }
    return response.responseSuccess(res, StatusCodes.OK, result)
})

// get history
pengawasController.get('/reservation-completed', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if (role != 0) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    let result = await pengawasService.getAllStudentByNimWithHistoryWithStudentsAndConseolour()
    if (!result) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail query")
    }
    return response.responseSuccess(res, StatusCodes.OK, result)
})

// assign to coordinator
pengawasController.get('/approved/:id', jwt.validateToken, async (req, res) => {
    let role = req.user.role
    if (role != 0) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    let idRes = req.params.id
    let result = await pengawasService.toCoordinator(idRes)
    if (result.error) {
        if (!result) {
            let error = data.error
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }
    let dataValues = data.data
    return response.responseSuccess(res, StatusCodes.OK, dataValues)
})




module.exports = {
    pengawasController
}
