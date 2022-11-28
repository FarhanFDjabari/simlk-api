const express = require('express');
const koordinatorController = express.Router()
const response = require('../utils/response')
const koordinatorService = require('../repository/koordinator')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

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

//Lengkapi profile


module.exports = {
    koordinatorController
}
