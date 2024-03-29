const { notificationsStudent } = require('../model/entity_model')

const createNotif = (nim, title, body, id_reservasi, status) => {
    return notificationsStudent.create({
        nim: nim,
        title: title,
        body: body,
        id_reservasi: id_reservasi,
        status: status
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getAllNotif = (nim) => {
    return notificationsStudent.findAll({
        where: {
            nim: nim
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        var returnData = []

        for (i = 0; i < data.length; i++) {
            var temp = {
                nim: data[i].nim,
                title: data[i].title,
                body: data[i].body,
                data: {
                    id_reservasi: data[i].id_reservasi,
                    status: data[i].status
                },
                id: data[i].id,
                createdAt: data[i].createdAt,
                updatedAt: data[i].updatedAt,
                is_read: data[i].is_read
            }
            returnData.push(temp)
        }
        return returnData
    }).catch(function (_error) {
        return null
    })
}

const getById = (id) => {
    return notificationsStudent.findOne({
        where: {
            id: id
        }
    }).then(function (data) {
        if (!data) {
            return {}
        }
        var temp = {
            nim: data.nim,
            title: data.title,
            body: data.body,
            data: {
                id_reservasi: data.id_reservasi,
                status: data.status
            },
            id: data.id,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            is_read: data.is_read
        }

        return temp

    }).catch(function (_error) {
        return null
    })
}

const updateIsRead = (id, is_read) => {
    return notificationsStudent.update({
        is_read: is_read
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

const markAllRead = (nim) => {
    return notificationsStudent.update({
        is_read: 1
    }, {
        where: {
            is_read: 0,
            nim : nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const deleteByResId = (resId) => {
    return notificationsStudent.destroy({
        where: {
            id_reservasi: resId
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
    deleteByResId,
    updateIsRead,
    markAllRead
}
