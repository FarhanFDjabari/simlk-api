const { conselours, reservations } = require('../model/entity_model')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');

const searchByEmail = async (email) => {
    try {
        const data = await conselours.findOne({
            where: {
                email: email
            }
        });
        return data;
    } catch (_error) {
        return null;
    }
}

const searchById = async (id) => {
    try {
        const data = await conselours.findOne({
            where: {
                id: id
            }
        });
        return data;
    } catch (_error) {
        return null;
    }
}

const createCounselor = async (name, email, password, major, profile_image_url, fcm_token) => {
    let bcryptPassword = bcrypt.hashSync(password, 10);
    try {
        const data_1 = await conselours.create({
            email: email,
            password: bcryptPassword,
            name: name,
            major: major,
            role: 2,
            profile_image_url: profile_image_url,
            fcm_token: fcm_token
        });
        return data_1;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginConselours = async (email, password) => {
    const retDat = { login: false, id: 0 }
    return conselours.findOne({
        where: {
            email: email,
        }
    }).then(function (data) {
        if (data) {
            if (bcrypt.compareSync(password, data.password)) {
                retDat.login = true
                retDat.id = data.id
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
    return conselours.update({
        fcm_token: fcmToken
    }, {
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return
    })
}

const updateAvatar = async (id, profile_image_url) => {
    return conselours.update({
        profile_image_url: profile_image_url
    }, {
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return
    })
}

const updateJadwal = async (id, jadwal) => {
    return conselours.update({
        jadwal: jadwal
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

const getAllToken = async () => {
    return conselours.findAll({
        attributes: ['fcm_token'],
        where: {
            fcm_token: {
                [Op.ne]: null
            }
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const updateKetersediaan = async (id, is_available) => {
    return conselours.update({
        is_available: is_available
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

const getPerhari = async (hari) => {
    let data = { data: null, error: null }
    try {
        if (hari == 0) {
            let result = await conselours.findAll()
            data.data = result
        } else {
            let result = await conselours.findAll({
                where: {
                    jadwal: {
                        [Op.like]: `%${hari}%`
                    }
                }
            })
            data.data = result
        }
        return data
    } catch (error) {
        data.error = error
        return data
    }
}

const getHistoryById = async (id) => {
    let data = { data: null, error: null }
    try {
        let result = await reservations.findAll({
            where: {
                model: 2,
                id_conselour: id,
                status: 6
            },
            include : 'student'
        })
        return data
    } catch (error) {
        data.error = error
        return data
    }
}

const getReservationById = async (id) => {
    let data = { data: null, error: null }
    try {
        let result = await reservations.findAll({
            where: {
                model: 2,
                id_conselour: id,
                status: {
                    [Op.between]: [3, 5]
                }
            }
        })
        console.log(result)
        data.data = result
        return data
    } catch (error) {
        data.error = error
        return data
    }
}

module.exports = {
    searchByEmail,
    searchById,
    createCounselor,
    loginConselours,
    updateFcmToken,
    updateAvatar,
    getAllToken,
    updateJadwal,
    updateKetersediaan,
    getPerhari,
    getHistoryById,
    getReservationById
}
