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

const getAllNotif = () => {
    return notificationsStudent.findAll().then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}


module.exports = {
    createNotif,
    getAllNotif
}
