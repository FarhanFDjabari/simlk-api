const { notificationsStudent } = require('../model/entity_model')

const createNotif = (nim, title, body, id_reservasi) => {
    return notificationsStudent.create({
        nim : nim,
        title : title,
        body : body,
        id_reservasi : id_reservasi,
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
        if (data == null){
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const getById = (id) => {
    return notificationsStudent.findOne({
        where : {
            id : id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const updateIsRead = (id, is_read) => {
    return notificationsStudent.update({
        is_read : is_read
    }, {
        where : {
            id : id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const markAllRead = () => {
    return notificationsStudent.update({
        is_read : 1
    }, {
        where : {
            is_read : 0
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

module.exports = {
    createNotif,
    getAllNotif,
    getById,
    updateIsRead,
    markAllRead
}
