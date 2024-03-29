const express = require('express');
const auth = express.Router()
const { authToSiam } = require('../utils/siam_request')
const response = require('../utils/response')
const studentsService = require('../repository/students')
const conselorService = require('../repository/conselour')
const pengawasService = require('../repository/pengawas')
const koordinatorService = require('../repository/koordinator')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')
const { generateLink } = require('../utils/link_image')
const { uploadToSupabase } = require('../utils/supabase_storage')




auth.post('/login-siam', async (req, res) => {
    const { nim, password, fcm_token } = req.body

    // Auth to siam
    const result = await authToSiam(nim, password)

    if (!result) {
        return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Password or Username is false")
    }


    const isStudentExist = await studentsService.isStudentExist(result.nim)
    const token = jwt.generateToken(result.nim, 3)

    if (!isStudentExist) {
        const student = await studentsService.createStudents(result.nim, result.nama, result.prodi, result.image, fcm_token)
        if (student) {
            return response.responseSuccess(res, StatusCodes.CREATED, { token: token }, "Success auth with siam")
        }
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to create student")
    }

    const updateFcm = await studentsService.updateFcmToken(nim, fcm_token)
    if (!updateFcm) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to login student")
    }
    return response.responseSuccess(res, StatusCodes.OK, { token: token }, "Success auth with siam")
})


auth.post('/login-default', async (req, res) => {

    const { email, password, fcm_token, role } = req.body

    if (role == 2) {

        const conselor = await conselorService.loginConselours(email, password)
        if (!conselor) {
            return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Email not registered")
        }

        if (!conselor.login) {
            return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Password don't match")
        }
        const token = jwt.generateToken(conselor.id, 2)

        const isFail = await conselorService.updateFcmToken(conselor.id, fcm_token)

        if (isFail == null) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to login")
        }

        return response.responseSuccess(res, StatusCodes.OK, { token: token }, "Login success")
    }

    if (role == 0) {
        const pengawas = await pengawasService.loginPengawas(email, password)
        if (!pengawas) {
            return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Email not registered")
        }
        console.log(pengawas.login)
        if (pengawas.login == false) {

            return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Password don't match")
        }
        const token = jwt.generateToken(pengawas.id, 0)

        const isFail = await pengawasService.updateFcmToken(pengawas.id, fcm_token)

        if (isFail == null) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to login")
        }

        return response.responseSuccess(res, StatusCodes.OK, { token: token }, "Login success")
    }

    if (role == 1) {
        const koordinator = await koordinatorService.loginKoordinator(email, password)
        if (!koordinator) {
            return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Email not registered")
        }
        if (koordinator.login == false) {

            return response.responseFailure(res, StatusCodes.UNAUTHORIZED, "Password don't match")
        }
        const token = jwt.generateToken(koordinator.id, 1)

        const isFail = await koordinatorService.updateFcmToken(koordinator.id, fcm_token)

        if (isFail == null) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to login")
        }

        return response.responseSuccess(res, StatusCodes.OK, { token: token }, "Login success")
    }



})

auth.post('/register-conselour', async (req, res) => {
    const { name, email, password, nim, major, no_hp, id_line, fcm_token } = req.body
    if (req.files) {
        const { avatar } = req.files
        let nameFile = `${email}${avatar.name}`
        avatar.name = nameFile
        let link = generateLink(avatar.name)
        let status = await uploadToSupabase(avatar)
        if (!status) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when upload image")
        }
        const conselor = await conselorService.createCounselor(name, email, password, nim, major, id_line, no_hp, link, fcm_token)
        if (conselor == null) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to save conselor")
        }
        const token = jwt.generateToken(conselor.id, 2)
        return response.responseSuccess(res, StatusCodes.CREATED, { token: token }, "Success create conselour")
    } else {
        const conselor = await conselorService.createCounselor(name, email, password, nim, major, id_line, no_hp, "", fcm_token)
        if (conselor == null) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to save conselor")
        }
        const token = jwt.generateToken(conselor.id, 2)
        return response.responseSuccess(res, StatusCodes.CREATED, { token: token }, "Success create conselour")
    }
})

auth.post('/register-koordinator', async (req, res) => {
    const { email, password, name, nim, no_hp, id_line, fcm_token } = req.body
    let result = await koordinatorService.createKoordinator(email, password, name, nim, no_hp, id_line, fcm_token)
    if (result.error) {
        return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, result.error)
    }
    const token = jwt.generateToken(result.data.id, 1)
    return response.responseSuccess(res, StatusCodes.CREATED, { token: token }, "Success create koordinator")
})

auth.post('/register-pengawas', async (req, res) => {
    const { email, password, name, fcm_token } = req.body
    if (req.files) {
        const { avatar } = req.files
        let nameFile = `${email}${avatar.name}`
        avatar.name = nameFile
        let link = generateLink(avatar.name)
        let status = await uploadToSupabase(avatar)
        if (!status) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when upload image")
        }
        const data = await pengawasService.createPengawas(email, password, name, link, fcm_token)
        if (data.error) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when save to db")
        }
        const token = jwt.generateToken(data.data.id, 0)
        return response.responseSuccess(res, StatusCodes.CREATED, { token: token }, "Success create pengawas")
    } else {
        const data = await pengawasService.createPengawas(email, password, name, "", fcm_token)
        if (data.error) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail when save to db")
        }
        const token = jwt.generateToken(data.data.id, 0)
        return response.responseSuccess(res, StatusCodes.CREATED, { token: token }, "Success create pengawas")
    }
})

auth.get('/logout', jwt.validateToken, async (req, res) => {
    //claims jwt
    const role = req.user.role
    const id = req.user.id
    if (role == 0) {
        const data = await pengawasService.updateFcmToken(id, null)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to logout pengawas")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success logout")
    }
    if (role == 1) {
        const data = await koordinatorService.updateFcmToken(id, null)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to logout conselor")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success logout")
    }

    if (role == 2) {
        const data = await conselorService.updateFcmToken(id, null)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to logout koordinator")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success logout")
    }

    if (role == 3) {
        const data = await studentsService.updateFcmToken(id, null)
        if (!data) {
            return response.responseFailure(res, StatusCodes.INTERNAL_SERVER_ERROR, "Fail to logout mahasiswa")
        }
        return response.responseSuccess(res, StatusCodes.OK, null, "Success logout")
    }
    return response.responseFailure(res, StatusCodes.BAD_REQUEST, "Fail logout")

})

module.exports = {
    auth
}

