const { conselours } = require('../model/entity_model')
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

module.exports = {
    searchByEmail,
    searchById,
    createCounselor,
    loginConselours,
    updateFcmToken,
    updateAvatar,
    getAllToken
}
