const { students, reservations, conselours } = require('../model/entity_model')
const { Op } = require('sequelize');
const conselorService = require('../repository/conselour')

const createStudents = (nim, name, major, profile_image_url, fcm_token) => {
    return students.create({
        nim: nim,
        name: name,
        major: major,
        role: 1,
        profile_image_url: profile_image_url,
        fcm_token: fcm_token
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const updateProfile = (nim, id_line, no_hp, dpa, profile_image_url, email) => {
    return students.update({
        no_hp: no_hp,
        id_line: id_line,
        dpa: dpa,
        profile_image_url: profile_image_url,
        email: email
    }, {
        where: {
            nim: nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const updateFcmToken = (nim, token) => {
    return students.update({
        fcm_token: token
    }, {
        where: {
            nim: nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const searchStudentByNimWithReservations = (nim) => {
    return reservations.findAll({
        where: {
            nim: nim,
            status: {
                [Op.between]: [1, 3]
            }
        },
    }).then(function (data) {
        const dataWithConselourId = data.filter(
            (singleData) => singleData.id_conselour !== null
        );

        const arrOfPromise = dataWithConselourId.map((singleData) =>
            conselorService.searchById(singleData.id_conselour).then(res=> {
                return ({...res.toJSON(), reservation : singleData.toJSON()})
            })
        );

        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) =>{
                const structured ={...singleData.reservation};
                delete singleData.reservation
                return ({...structured, conselour : singleData})
            })
        );

        return returnData
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const searchStudentByNimWithHistory = (nim) => {
    return reservations.findOne({
        where: {
            nim: nim,
            status: 4
        }
    }).then(function (data) {
        const dataWithConselourId = data.filter(
            (singleData) => singleData.id_conselour !== null
        );

        const arrOfPromise = dataWithConselourId.map((singleData) =>
            conselorService.searchById(singleData.id_conselour).then(res=> {
                return ({...res.toJSON(), reservation : singleData.toJSON()})
            })
        );

        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) =>{
                const structured ={...singleData.reservation};
                delete singleData.reservation
                return ({...structured, conselour : singleData})
            })
        );

        return returnData
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const getStudentByNimWithHistory = () => {
    return students.findAll({
        include: {
            model: reservations,
            as: 'reservations',
            where: {
                status: 4
            }
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


const getStudentByNimWithReservations = () => {
    return reservations.findAll({
        include: {
            model: students,
            as: 'student',
        },
        where: {
            status: {
                [Op.between]: [1, 3]
            }
        }
    }).then(function (data) {
        if (data == null) {
            data = []
        }
        console.log(`Data : ${data}`)
        return data
    }).catch(function (error) {
        console.log(`Error : ${error}`)
        return null
    })
}

const getProfile = (nim) => {
    return students.findOne({
        where: {
            nim: nim
        },

    }).then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}

const isStudentExist = (nim) => {
    return students.findOne({
        where: {
            nim: nim
        },
    }).then(function (data) {
        if (data) {
            return true
        }
        return false
    }).catch(function (_error) {
        return false
    })
}

const updatePicture = (linkPicture, nim) => {
    return students.update({
        profile_image_url: linkPicture
    }, {
        where: {
            nim: nim
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const getAllStudent = () => {
    return students.findAll().then(function (data) {
        if (data == null) {
            data = []
        }
        return data
    }).catch(function (_error) {
        return null
    })
}


module.exports = {
    createStudents,
    searchStudentByNimWithReservations,
    searchStudentByNimWithHistory,
    getProfile,
    isStudentExist,
    updatePicture,
    updateFcmToken,
    updateProfile,
    getAllStudent,
    getStudentByNimWithHistory,
    getStudentByNimWithReservations
}
