const { notificationsConselour } = require('../model/entity_model')

const createNotif = (title, body, id_reservasi, model, id_konselor ) => {
    return notificationsConselour.create({
        title: title,
        body: body,
        id_reservasi: id_reservasi,
        model : model,
        id_konselor : id_konselor
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getAllNotif = (model) => {
    return notificationsConselour.findAll({
        where : {
            model : model
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        var returnData = []

        for (i = 0; i < data.length; i++) {
            var temp = {
                id: data[i].id,
                nim: data[i].nim,
                title: data[i].title,
                body: data[i].body,
                data: {
                    id_reservasi: data[i].id_reservasi,
                    status: data[i].status
                },
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

const getAllNotifForId = (id, model) => {
  return notificationsConselour.findAll({
      where : {
          id_konselor: id,
          model : model
      }
  }).then(function (data) {
      if (data == null) {
          data = []
      }
      var returnData = []

      for (i = 0; i < data.length; i++) {
          var temp = {
              id: data[i].id,
              nim: data[i].nim,
              title: data[i].title,
              body: data[i].body,
              data: {
                  id_reservasi: data[i].id_reservasi,
                  status: data[i].status
              },
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

const getById = (id, model) => {
    return notificationsConselour.findOne({
        where: {
            id: id,
            model : model
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

const updateIsRead = (id, is_read, model, id_konselor) => {
    return notificationsConselour.update({
        is_read: is_read
    }, {
        where: {
            id: id,
            model : model,
            id_konselor  : id_konselor
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const markAllRead = (model, id_konselor ) => {
    return notificationsConselour.update({
        is_read: 1
    }, {
        where: {
            is_read: 0,
            model : model,
            id_konselor : id_konselor
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
    getAllNotifForId,
    updateIsRead,
    markAllRead,
}
