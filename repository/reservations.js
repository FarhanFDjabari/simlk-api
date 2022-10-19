const reservations = require('../model/entity_model').reservations


const createReservation = (nim, reservation_time, status, description) => {
    return reservations.create({
        nim : nim,
        reservation_time : reservation_time,
        time_hours : time_hours,
        status : status,
        description : description
    }).then(function(data){
        return data
    }).catch(function(_error){
        return null
    })
}

const getAll = () => {
    return reservations.findAll().then(function(data){
        return data
    }).catch(function(_error){
        return null
    })
}

const getById = (id) => {
    return reservations.findOne({
        where : {
            id : id
        }
    }).then(function(data){
        return data
    }).catch(function(_error){
        return null
    })
}

const getByNim = (nim) => {
    return reservations.findOne({
        where : {
            nim : nim
        }
    }).then(function(data){
        return data
    }).catch(function(_error){
        return null
    })
}

const paginate = (page, offset) => {
    return reservations.fi
}

module.exports = {
    createReservation,
    getAll,
    getById,
    getByNim
}
