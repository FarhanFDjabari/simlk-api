const express = require('express');
const conselour = express.Router()
const response = require('../utils/response')
const conseloursService = require('../repository/conselour')
const reservationsService = require('../repository/reservations')
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

conselour.put('/profile', jwt.validateToken, async (req, res) => {
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
        const updateData = await conseloursService.updateAvatar(id, link)
        if (!updateData) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        return response.responseSuccess(res, StatusCodes.OK, updateData, "Success update profile")
    }
    return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Profile not update")
})

module.exports = {
    conselour
}
