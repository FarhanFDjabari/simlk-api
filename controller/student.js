const express = require('express');
const students = express.Router()
const response = require('../utils/response')
const studentsService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const {uploadToSupabase} = require('../utils/supabase_storage')
const {generateLink} = require('../utils/link_image')

students.get('/profile', jwt.validateToken, async (req, res) => {
    const nim = req.user.id
    const data = await studentsService.getProfile(nim)

    if (!data){
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when query database")
    }

    return response.responseSuccess(res, StatusCodes.OK, data, "Success get profile" )
})

students.put('/profile', jwt.validateToken, async (req, res) => {
    const nim = req.user.id
    const studentData = await studentsService.getProfile(nim)
    const {id_line, no_hp , dpa} = req.body

    if (!req.files){
        const updatedData = await studentsService.updateProfile(nim, id_line, no_hp, dpa, studentData.profile_image_url)
        if (!updatedData){
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        return response.responseSuccess(res, StatusCodes.OK, updatedData, "Success update profile" )
    }else {
        const {avatar} = req.files
        let nameFile = `${nim}${avatar.name}`
        avatar.name = nameFile
        let link = generateLink(avatar.name)
        let status = await uploadToSupabase(avatar)
        if (!status){
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when upload image")
        }
        const updatedData = await studentsService.updateProfile(studentData.nim, studentData.id_line, studentData.no_hp, studentData.dpa, link)
        if (!updatedData){
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when update database")
        }
        return response.responseSuccess(res, StatusCodes.OK, updatedData, "Success update profile" )
    }
})




module.exports = {
    students
}
