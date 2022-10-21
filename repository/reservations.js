const reservations = require('../model/entity_model').reservations
const { Op } = require('sequelize');

const createReservation = (nim, reservation_time, time_hours, description) => {
    return reservations.create({
        nim: nim,
        reservation_time: reservation_time,
        time_hours: time_hours,
        description: description
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getAll = () => {
    return reservations.findAll().then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getById = (id) => {
    return reservations.findOne({
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getByNim = (nim) => {
    return reservations.findOne({
        where: {
            nim: nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}



const paginateFinish = (page, limit) => {
    if (!page){
        page = 1
    }
    if (!limit){
        limit = 20
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 5);
    end.setHours(23, 59, 59, 999);

    return reservations.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        where: {
            reservation_time: {
                [Op.between]: [start, end]
            },
            status : 4
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const paginateFinishByNim = (page, limit, nim) => {
    if (!page){
        page = 1
    }
    if (!limit){
        limit = 20
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 5);
    end.setHours(23, 59, 59, 999);

    return reservations.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        where: {
            reservation_time: {
                [Op.between]: [start, end]
            },
            nim : nim,
            status : 4,
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const findNotFinishByNim = (nim) => {
    return reservations.findAndCountAll({
        where : {
            status : {
                [Op.between]: [1, 3]
            },
            nim : nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })

}


module.exports = {
    createReservation,
    getAll,
    getById,
    getByNim,
    paginateFinish,
    findNotFinishByNim,
    paginateFinishByNim
}
