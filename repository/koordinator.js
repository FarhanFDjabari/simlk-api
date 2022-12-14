const { koordinator, reservations, conselours } = require('../model/entity_model')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');

const createKoordinator = async (email, password, name, major, nim, no_hp, id_line) => {
    var returnData = { data: null, error: null }
    try {
        let enPass = bcrypt.hashSync(password, 10)
        const isCreated = await koordinator.create({
            email: email,
            password: enPass,
            name: name,
            major: major,
            no_hp: no_hp,
            id_line: id_line,
            nim: nim,
            role: 1,
        })
        returnData.data = isCreated.dataValues
        return returnData
    } catch (error) {
        returnData.error = error
        returnData.data = null
        return returnData
    }
}

const readAll = async () => {
    var returnData = { data: null, error: null }
    try {
        const dataAll = await koordinator.findAll()
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
        const dataId = await koordinator.findOne({
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

const update = async (id, profile_image_url, fcm_token, nim) => {
    var returnData = { data: null, error: null }
    if (!profile_image_url) {
        try {
            const dataId = await koordinator.update({
                fcm_token: fcm_token,
                nim: nim,
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
            const dataId = await koordinator.update({
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
            const dataId = await koordinator.update({
                profile_image_url: profile_image_url,
                fcm_token: fcm_token,
                nim: nim,
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

const deleteKoordinator = async (id) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await koordinator.destroy({
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

const selectKonselor = async (id_res, id_kon, status) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await reservations.update({
            id_conselour: id_kon,
            status: status
        }, {
            where: {
                id: id_res
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

const loginKoordinator = async (email, password) => {
    const retDat = { login: false, id: 0 }
    return koordinator.findOne({
        where: {
            email: email,
        }
    }).then(function (data) {
        if (data) {
            if (bcrypt.compareSync(password, data.password)) {
                retDat.login = true
                retDat.id = data.id
                console.log(true)
                return retDat
            } else {
                return retDat;
            }
        } else {
            return null;
        }
    }).catch(function (_err) {
        return null;
    });
}

const updateFcmToken = async (id, fcmToken) => {
    return koordinator.update({
        fcm_token: fcmToken
    }, {
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

//get reservation where status = 2
const findAllResAssign = async (status) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await reservations.findAll({
            where: {
                status: status
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

const getConselorPadaTanggalReservasi = async (id_res) => {
    var returnData = { data: null, error: null }
    try {
        let reservasi = await reservations.findOne({
            where: {
                id: id_res
            }
        })
        let day = new Date(reservasi.reservation_time).getDay()
        let konselor = await conselours.findAll({
            where: {
                jadwal : {
                    [Op.like]: `%${day}%`
                }
            }
        })
        returnData.data = konselor
        return returnData
    } catch (error) {
        returnData.error = error
        returnData.data = null
        return returnData
    }
}

const updateProfile = async (id, nim, name, profile_image_url) => {
    var returnData = { data: null, error: null }
    try {
        let data = await koordinator.update({
            nim : nim,
            name : name,
            profile_image_url : profile_image_url
        }, {
            where : {
                id : id
            }
        })
        return data
    } catch (error) {
        returnData.error = error
        returnData.data = null
        return returnData
    }
}

const getFcmToken = async () => {
    try {
        return await koordinator.findAll({
            where : {
                [Op.ne] : [null]
            },
            attributes : ['fcm_token']
        })
    }catch (error){
        console.log(error)
        return null
    }
}



module.exports = {
    createKoordinator,
    readAll,
    readById,
    update,
    deleteKoordinator,
    selectKonselor,
    updateFcmToken,
    loginKoordinator,
    findAllResAssign,
    getConselorPadaTanggalReservasi,
    updateProfile,
    getFcmToken
}
