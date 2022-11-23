const { pengawas, reservations } = require('../model/entity_model')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');

const createPengawas = async (email, password, name, profile_image_url, fcm_token) => {
    var returnData = { data: null, error: null }
    try {
        let enPass = bcrypt.hashSync(password, 10)
        let saveData = await pengawas.create({
            email: email,
            password: enPass,
            name: name,
            profile_image_url: profile_image_url,
            fcm_token: fcm_token,
            role: 0,
        })
        returnData.data = saveData.dataValues
    } catch (error) {
        returnData.error = error
    }
    return returnData
}

const readAll = async () => {
    var returnData = { data: null, error: null }
    try {
        const dataAll = await pengawas.findAll()
        returnData.data = dataAll
    } catch (error) {
        returnData.error = error
        returnData.data = null
    }
    return returnData
}

const readById = async (id) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await pengawas.findOne({
            where: {
                id: id,
            }
        })
        returnData.data = dataId
    } catch (error) {
        returnData.error = error
        returnData.data = null
    }
    return returnData
}

const update = async (id, profile_image_url, fcm_token, name, email) => {
    var returnData = { data: null, error: null }
    if (!profile_image_url) {
        try {
            const dataId = await pengawas.update({
                fcm_token: fcm_token,
                name: name,
                email: email
            }, {
                where: {
                    id: id
                }
            })
            returnData.data = dataId.dataValues
        } catch (error) {
            returnData.error = error
            returnData.data = null
        }
    } else if (!fcm_token) {
        try {
            const dataId = await pengawas.update({
                profile_image_url: profile_image_url
            }, {
                where: {
                    id: id
                }
            })
            returnData.data = dataId.dataValues
        } catch (error) {
            returnData.error = error
            returnData.data = null
        }
    } else {
        try {
            const dataId = await pengawas.update({
                profile_image_url: profile_image_url,
                fcm_token: fcm_token
            }, {
                where: {
                    id: id
                }
            })
            returnData.data = dataId.dataValues
        } catch (error) {
            returnData.error = error
            returnData.data = null
        }
    }
    return returnData
}

const deletePengawas = async (id) => {
    var returnData = { data: null, error: null }
    try {
        const dataId = await pengawas.destroy({
            where: {
                id: id
            }
        })
        returnData.data = dataId.dataValues
    } catch (error) {
        returnData.error = error
        returnData.data = null
    }
    return returnData
}

const searchStudentByNimWithHistoryWithStudentsAndConseolour = (nim) => {
    return reservations.findAll({
        where: {
            nim: nim,
            status: 4
        },
        include: {
            model: students,
            as: 'student',
        },
    }).then(function (data) {
        console.log(data)
        if (data == null) {
            return []
        }
        const dataWithConselourId = data.filter(
            (singleData) => singleData.id_conselour !== null
        );

        const arrOfPromise = dataWithConselourId.map((singleData) =>
            conselorService.searchById(singleData.id_conselour).then(res => {
                if (!res) {
                    return ({ reservation: singleData.toJSON() })
                }
                return ({ ...res.toJSON(), reservation: singleData.toJSON() })
            })
        );

        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) => {
                const structured = { ...singleData.reservation };
                delete singleData.reservation
                return ({ ...structured, conselour: singleData })
            })
        );
        return returnData
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const searchStudentByNimWithReservationWithStudentsAndConseolour = (nim) => {
    return reservations.findAll({
        where: {
            nim: nim,
            status: {
                [Op.between]: [1, 3]
            }
        },
        include: {
            model: students,
            as: 'student',
        },
    }).then(function (data) {
        console.log(data)
        if (data == null) {
            return []
        }
        const dataWithConselourId = data.filter(
            (singleData) => singleData.id_conselour !== null
        );

        const arrOfPromise = dataWithConselourId.map((singleData) =>
            conselorService.searchById(singleData.id_conselour).then(res => {
                if (!res) {
                    return ({ reservation: singleData.toJSON() })
                }
                return ({ ...res.toJSON(), reservation: singleData.toJSON() })
            })
        );

        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) => {
                const structured = { ...singleData.reservation };
                delete singleData.reservation
                return ({ ...structured, conselour: singleData })
            })
        );
        return returnData
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const getAllStudentByNimWithReservationWithStudentsAndConseolour = () => {
    return reservations.findAll({
        where: {
            status: {
                [Op.between]: [1, 3]
            }
        },
        include: {
            model: students,
            as: 'student',
        },
    }).then(function (data) {
        console.log(data)
        if (data == null) {
            return []
        }
        const dataWithConselourId = data.filter(
            (singleData) => singleData.id_conselour !== null
        );

        const arrOfPromise = dataWithConselourId.map((singleData) =>
            conselorService.searchById(singleData.id_conselour).then(res => {
                if (!res) {
                    return ({ reservation: singleData.toJSON() })
                }
                return ({ ...res.toJSON(), reservation: singleData.toJSON() })
            })
        );

        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) => {
                const structured = { ...singleData.reservation };
                delete singleData.reservation
                return ({ ...structured, conselour: singleData })
            })
        );
        return returnData
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const getAllStudentByNimWithHistoryWithStudentsAndConseolour = () => {
    return reservations.findAll({
        where: {
            status: {
                [Op.between]: [1, 3]
            }
        },
        include: {
            model: students,
            as: 'student',
        },
    }).then(function (data) {
        console.log(data)
        if (data == null) {
            return []
        }
        const dataWithConselourId = data.filter(
            (singleData) => singleData.id_conselour !== null
        );

        const arrOfPromise = dataWithConselourId.map((singleData) =>
            conselorService.searchById(singleData.id_conselour).then(res => {
                if (!res) {
                    return ({ reservation: singleData.toJSON() })
                }
                return ({ ...res.toJSON(), reservation: singleData.toJSON() })
            })
        );

        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) => {
                const structured = { ...singleData.reservation };
                delete singleData.reservation
                return ({ ...structured, conselour: singleData })
            })
        );
        return returnData
    }).catch(function (error) {
        console.log(error)
        return null
    })
}

const toCoordinator = async (id_reservation) => {
    var data = { data: null, error: null }
    try {
        let res = await reservations.update({
            is_approved: true,
            model: 2
        }, {
            where: {
                id: id_reservation
            }
        })
        data.data = res.dataValues
    } catch (error) {
        data.error = error
    }
    return data
}

const takeByPengawas = async (id_reservation, id_pengawas) => {
    var data = { data: null, error: null }
    try {
        let res = await reservations.update({
            model: 0,
            id_conselour: id_pengawas,
        }, {
            where: {
                id: id_reservation
            }
        })
        data.data = res.dataValues
    } catch (error) {
        data.error = error
    }
    return data
}

const loginPengawas = async (email, password) => {
    const retDat = { login: false, id: 0 }
    return pengawas.findOne({
        where: {
            email: email,
        }
    }).then(function (data) {
        if (data) {
            if (bcrypt.compareSync(password, data.password)) {
                retDat.login = true
                retDat.id = data.id
                console.log(true)
                return retDat
            } else {
                return retDat;
            }
        } else {
            return null;
        }
    }).catch(function (_err) {
        return null;
    });
}

const updateFcmToken = async (id, fcmToken) => {
    return pengawas.update({
        fcm_token: fcmToken
    }, {
        where: {
            id: id
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return
    })
}

module.exports = {
    createPengawas,
    readAll,
    readById,
    update,
    deletePengawas,
    searchStudentByNimWithHistoryWithStudentsAndConseolour,
    searchStudentByNimWithReservationWithStudentsAndConseolour,
    getAllStudentByNimWithHistoryWithStudentsAndConseolour,
    getAllStudentByNimWithReservationWithStudentsAndConseolour,
    toCoordinator,
    takeByPengawas,
    loginPengawas,
    updateFcmToken
}

