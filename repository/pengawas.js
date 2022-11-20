const { pengawas } = require('../model/entity_model')
const bcrypt = require('bcrypt')

const createPengawas = async (email, password, name, profile_image_url, fcm_token) => {
    var returnData = { data: null, error: null }
    try {
        let enPass = bcrypt.hashSync(password, 10)
        let saveData = await pengawas.create({
            email : email,
            password : enPass,
            name : name,
            profile_image_url : profile_image_url,
            fcm_token : fcm_token,
            role : 0,
        })
        returnData.data = saveData.dataValues
    } catch (error){
        returnData.error = error
    }
    return returnData
}

const readAll = async () => {
    var returnData = { data: null, error: null }
    try {
        const dataAll = await pengawas.findAll()
        returnData.data = dataAll
        return returnData
    } catch (error) {
        returnData.error = error
        returnData.data = null
        return returnData
    }
}

const readById = async (id) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await pengawas.findOne({
            where: {
                id: id,
            }
        })
        returnData.data = dataId
        return returnData
    } catch (error) {
        returnData.error = error
        returnData.data = null
        return returnData
    }
}

const update = async (id, profile_image_url, fcm_token, name, email) => {
    var returnData = { data: null, error: null }
    if (!profile_image_url) {
        try {
            const dataId = await pengawas.update({
                fcm_token: fcm_token,
                name : name,
                email : email
            }, {
                where: {
                    id: id
                }
            })
            returnData.data = dataId.dataValues
            return returnData
        } catch (error) {
            returnData.error = error
            returnData.data = null
            return returnData
        }
    } else if (!fcm_token) {
        try {
            const dataId = await pengawas.update({
                profile_image_url: profile_image_url
            }, {
                where: {
                    id: id
                }
            })
            returnData.data = dataId.dataValues
            return returnData
        } catch (error) {
            returnData.error = error
            returnData.data = null
            return returnData
        }
    } else {
        try {
            const dataId = await pengawas.update({
                profile_image_url: profile_image_url,
                fcm_token: fcm_token
            }, {
                where: {
                    id: id
                }
            })
            returnData.data = dataId.dataValues
            return returnData
        } catch (error) {
            returnData.error = error
            returnData.data = null
            return returnData
        }
    }
}

const deletePengawas = async (id) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await pengawas.destroy({
            where: {
                id: id
            }
        })
        returnData.data = dataId.dataValues
        return returnData
    } catch (error) {
        returnData.error = error
        returnData.data = null
        return returnData
    }
}


