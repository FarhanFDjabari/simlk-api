const { notificationsConselour } = require('../model/entity_model')

const createNotif = (title, body, data) => {
    return notificationsConselour.create({
        title : title,
        body : body,
        data : data
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

const getById = (id) => {
    return notificationsConselour.findOne({
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
    return notificationsConselour.update({
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
    return notificationsConselour.update({
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
