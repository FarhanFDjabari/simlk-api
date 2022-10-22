const { notificationsConselour } = require('../model/entity_model')

const createNotif = (nim, title, body, data) => {
    return notificationsConselour.create({
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
    return notificationsConselour.findAll().then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}


module.exports = {
    createNotif,
    getAllNotif
}
