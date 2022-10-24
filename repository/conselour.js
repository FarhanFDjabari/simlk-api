const { conselours } = require('../model/entity_model')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');

const searchByEmail = (email) => {
    return conselours.findOne({
        where: {
            email: email
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const searchById = (id) => {
    return conselours.findOne({
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const createCounselor = (name, email, password, major, profile_image_url, fcm_token) => {
    let bcryptPassword = bcrypt.hashSync(password, 10);
    return conselours.create({
        email: email,
        password: bcryptPassword,
        name: name,
        major: major,
        role: 0,
        profile_image_url: profile_image_url,
        fcm_token: fcm_token
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const loginConselours = (email, password) => {
    return conselours.findOne({
        where: {
            email: email,
        }
    }).then(function (data) {
        if (data) {
            if (bcrypt.compareSync(password, data.password)) {
                return data
            } else {
                return false;
            }
        } else {
            return null;
        }
    }).catch(function (_err) {
        return null;
    });
}

const updateFcmToken = (id, fcmToken) => {
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

const updateAvatar = (id, profile_image_url) => {
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

const getAllToken = () => {
    return conselours.findAll({
        attributes : ['fcm_token'],
        where : {
            fcm_token : {
                [Op.ne] : null
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
