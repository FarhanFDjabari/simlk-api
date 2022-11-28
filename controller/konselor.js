const express = require('express');
const conselour = express.Router()
const response = require('../utils/response')
const conseloursService = require('../repository/conselour')
const studentService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const { uploadToSupabase } = require('../utils/supabase_storage')
const { generateLink } = require('../utils/link_image')
const { v4: uuidv4 } = require('uuid');

conselour.get('/profile', jwt.validateToken, async (req, res) => {
    let id = req.user.id

    const data = await conseloursService.searchById(id)

    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "Success get data from database")
})

conselour.put('/jadwal', jwt.validateToken, async (req, res) => {
    let id = req.user.id
    let role = req.user.role
    if (role != 2) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    const { jadwal } = req.body
    let result = await conseloursService.updateJadwal(id, jadwal)

    if (!result) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database")
    }

    result = null
    return response.responseSuccess(res, StatusCodes.OK, {}, "Success update data from database")
})

conselour.put('/profile', jwt.validateToken, async (req, res) => {
    let { jadwal } = req.body
    let id = req.user.id
    if (req.files) {
        const { avatar } = req.files
        let unique = uuidv4()
        let nameFile = `${unique}${id}${avatar.name}`
        avatar.name = nameFile
        let link = generateLink(avatar.name)
        let status = await uploadToSupabase(avatar)
        if (!status) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when upload image")
        }
        var updateData = await conseloursService.updateAvatar(id, link)
        if (!updateData) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        if (jadwal) {
            updateData = await conseloursService.updateJadwal(id, jadwal)
            if (!updateData) {
                return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
            }
            return response.responseSuccess(res, StatusCodes.OK, null, "Success update profile")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success update profile")
    } else {
        const updateData = await conseloursService.updateJadwal(id, jadwal)
        if (!updateData) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success update profile")
    }
})

conselour.get('/history-completed', jwt.validateToken, async (req, res) => {
    const data = await studentService.getStudentByNimWithHistory()
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database because no history")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success get history completed")
})

conselour.get('/history-uncompleted', jwt.validateToken, async (req, res) => {
    const data = await studentService.getStudentByNimWithReservations()
    if (!data) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database")
    }
    return response.responseSuccess(res, StatusCodes.OK, data, "Success get history uncompleted")
})

conselour.get('/ketersediaan/:is_available', jwt.validateToken, async (req, res) => {
    let id = req.user.id
    let role = req.user.role
    let isAvailable = req.params.is_available
    if (role != 2) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Unauthorized")
    }
    let result = await conseloursService.updateKetersediaan(id, isAvailable)
    if (!result) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database")
    }

    result = null
    return response.responseSuccess(res, StatusCodes.OK, {}, "Success update data from database")
})

module.exports = {
    conselour
}
