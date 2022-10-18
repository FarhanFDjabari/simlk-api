const express = require('express');
const auth = express.Router()
const { authToSiam } = require('../utils/siam_request')
const response = require('../utils/response')
const studentsService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const {StatusCodes} = require('http-status-codes')

auth.post('/login-siam', async (req, res) => {
    const { nim, password, fcm_token } = req.body

    // Auth to siam
    const result = await authToSiam(nim, password)

    if (!result) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, null, "Password or Username is false")
    }

    const isStudentExist = await studentsService.isStudentExist(result.nim)
    const token = jwt.generateToken(result.nim)

    if (!isStudentExist){
        const student  = await studentsService.createStudents(result.nim,result.nama,result.prodi, result.image, fcm_token)
        if (student){
            return response.responseSuccess(res, StatusCodes.CREATED, token, "Success auth with siam")
        }
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, null, "Fail to create student")
    }

    return response.responseSuccess(res, StatusCodes.OK, token, "Success auth with siam")
})


module.exports = {
    auth
}

