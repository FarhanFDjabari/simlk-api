const express = require('express');
const pengawasController = express.Router()
const response = require('../utils/response')
const pengawasService = require('../repository/pengawas')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

pengawasController.get('/profile', jwt.validateToken, async (req, res) => {
    let id = req.user.id
    let data = await pengawasService.readById(id)
    if (data.error){
        let error = data.error
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
    let dataValues = data.data
    return response.responseSuccess(res, StatusCodes.OK, dataValues)
})



module.exports = {
    pengawasController
}
