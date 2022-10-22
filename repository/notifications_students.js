const { notificationsStudent } = require('../model/entity_model')

const createNotif = (nim, title, body, data) => {
    return notificationsStudent.create({
        nim : nim,
        title : title,
        body : body
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getAllNotif = (nim) => {
    return notificationsStudent.findAll({
        where : {
            nim : nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}


module.exports = {
    createNotif,
    getAllNotif
}
