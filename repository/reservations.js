const reservations = require('../model/entity_model').reservations
const students = require('../model/entity_model').students
const conselour = require('../model/entity_model').conselours
const { Op } = require('sequelize');

const createReservation = async (nim, reservation_time, time_hours, description, type) => {
    try {
        const data = await reservations.create({
            nim: nim,
            reservation_time: reservation_time,
            time_hours: time_hours,
            description: description,
            type: type
        });
        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

const getAll = () => {
    return reservations.findAll({
        where: {
            status: 6,
        },
        include: {
            model: students,
            as: 'student'
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const getById = (id) => {
    return reservations.findOne({
        where: {
            id: id
        },
    }).then(function (data) {
        console.log(data)
        return data
    }).catch(function (_error) {
        return null
    })
}

const getByIdWithconselour = (id) => {
    return reservations.findOne({
        where: {
            id: id
        },
        include : {
            model : conselour,
            as : 'conselour'
        }
    }).then(function (data) {
        console.log(data)
        return data
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const getByIdAndProfile = (id) => {
    return reservations.findOne({
        where: {
            id: id
        },
        include: {
            model: students,
            as: 'student'
        }
    }).then(function (data) {
        return data
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const getByNim = (nim) => {
    return reservations.findAll({
        where: {
            nim: nim,
            status: 6
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}



const paginateFinish = (page, limit) => {
    if (!page) {
        page = 1
    }
    if (!limit) {
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
            status: 6
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const paginateFinishByNim = (page, limit, nim) => {
    if (!page) {
        page = 1
    }
    if (!limit) {
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
            nim: nim,
            status: 6,
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const finishByNim = (nim) => {
    return reservations.findAll({
        where: {
            nim: nim,
            status: 6,
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const findNotFinishByNim = (nim) => {
    // if (!page) {
    //     page = 1
    // }
    // if (!limit) {
    //     limit = 20
    // }
    return reservations.findAll({
        // offset: (page - 1) * limit,
        // limit: limit,
        where: {
            status: {
                [Op.between]: [1, 5]
            },
            nim: nim
        }

    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const updateStatus = (id, status) => {
    return reservations.update({
        status: status
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

const updateLocation = (id, location) => {
    return reservations.update({
        location: location
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

const deleteById = (id) => {
    return reservations.destroy({
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getByDay = (day) => {
    const dayReq = new Date(day)
    return reservations.findAll({
        where: {
            reservation_time: dayReq
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        console.log(data)
        return data
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const updateReport = (id, report) => {
    return reservations.update({
        report: report,
        status: 6,
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

const updateFileReport = (id, file_report) => {
    return reservations.update({
        file_report: file_report,
        status: 6,
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

const reservationSchedule = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 366);
    end.setHours(23, 59, 59, 999);

    return reservations.findAll({
        where: {
            reservation_time: {
                [Op.between]: [start, end]
            },
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const reservationScheduleMahasiswa = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 366);
    end.setHours(23, 59, 59, 999);

    return reservations.findAll({
        attributes: ['time_hours'],
        where: {
            reservation_time: {
                [Op.between]: [start, end]
            },
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}


const getReservationsByDate = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0)
    console.log(start)
    var day = 60 * 60 * 24 * 1000;
    const end = new Date(start.getTime() + day)

    return reservations.findAll({
        attributes: ['time_hours'],
        where: {
            reservation_time: {
                [Op.between]: [start, end]
            },
        }
    }).then(function (data) {
        console.log(data)
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const getReservationFromTimeAndNim = (nim, time, time_hours) => {
    return reservations.findOne({
        where: {
            nim: nim,
            reservation_time: time,
            time_hours: time_hours
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const setKonselor = (id_conselour, id) => {
    return reservations.update({
        id_conselour: id_conselour
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

module.exports = {
    createReservation,
    getAll,
    getById,
    getByNim,
    paginateFinish,
    findNotFinishByNim,
    paginateFinishByNim,
    updateStatus,
    deleteById,
    getByDay,
    finishByNim,
    updateReport,
    reservationSchedule,
    updateLocation,
    getReservationsByDate,
    reservationScheduleMahasiswa,
    getByIdAndProfile,
    getReservationFromTimeAndNim,
    updateFileReport,
    setKonselor,
    getByIdWithconselour
}
