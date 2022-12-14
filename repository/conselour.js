const { conselours, reservations, students } = require('../model/entity_model')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');

const searchByEmail = async (email) => {
    try {
        const data = await conselours.findOne({
            where: {
                email: email
            }
        });
        return data;
    } catch (_error) {
        return null;
    }
}

const searchById = async (id) => {
    try {
        const data = await conselours.findOne({
            where: {
                id: id
            }
        });
        return data;
    } catch (_error) {
        return null;
    }
}

const createCounselor = async (name, email, password, nim, major, id_line, no_hp, profile_image_url, fcm_token) => {
    let bcryptPassword = bcrypt.hashSync(password, 10);
    try {
        const data_1 = await conselours.create({
            email: email,
            password: bcryptPassword,
            name: name,
            nim: nim,
            id_line: id_line,
            no_hp: no_hp,
            major: major,
            role: 2,
            profile_image_url: profile_image_url,
            fcm_token: fcm_token
        });
        return data_1;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginConselours = async (email, password) => {
    const retDat = { login: false, id: 0 }
    return conselours.findOne({
        where: {
            email: email,
        }
    }).then(function (data) {
        if (data) {
            if (bcrypt.compareSync(password, data.password)) {
                retDat.login = true
                retDat.id = data.id
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
    return conselours.update({
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

const updateAvatar = async (id, profile_image_url) => {
    return conselours.update({
        profile_image_url: profile_image_url
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

const updateJadwal = async (id, jadwal) => {
    return conselours.update({
        jadwal: jadwal
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

const updateProfile = async (id, nim, id_line, no_hp, is_available, profile_image_url) => {
  return conselours.update({
    nim: nim,
    id_line: id_line,
    no_hp: no_hp,
    is_available: is_available,
    profile_image_url: profile_image_url
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

const getAllToken = async () => {
    return conselours.findAll({
        attributes: ['fcm_token'],
        where: {
            fcm_token: {
                [Op.ne]: null
            }
        }
    }).then(function (data) {
        return data
    }).catch(function (_error) {
        return null
    })
}

const updateKetersediaan = async (id, is_available) => {
    return conselours.update({
        is_available: is_available
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

const getPerhari = async (hari) => {
    let data = { data: null, error: null }
    try {
        if (hari == 0) {
            let result = await conselours.findAll()
            data.data = result
        } else {
            let result = await conselours.findAll({
                where: {
                    jadwal: {
                        [Op.like]: `%${hari}%`
                    }
                }
            })
            data.data = result
        }
        return data
    } catch (error) {
        data.error = error
        return data
    }
}

const getHistoryById = async (id) => {
    let data = { data: null, error: null }
    try {
        let result = await reservations.findAll({
            where: {
                model: 2,
                id_conselour: id,
                status: 6
            },
            include: 'student'
        })
        data.data = result
        return data
    } catch (error) {
        data.error = error
        return data
    }
}

const getReservationById = async (id) => {
    let data = { data: null, error: null }
    try {
        let result = await reservations.findAll({
            where: {
                model: 2,
                id_conselour: id,
                status: {
                    [Op.between]: [3, 5]
                }
            },
            include: 'student'
        })
        console.log(result)
        data.data = result
        return data
    } catch (error) {
        data.error = error
        return data
    }
}

const getMahasiswaYangDitangani = async (id_conselour, { status1, status2 }) => {
    try {
        let result = await reservations.findAll({
            where: {
                status: {
                    [Op.between]: [status1, status2]
                },
                id_conselour: id_conselour
            }
        })
        let mahasiswaNim = []
        result.forEach(element => {
            if (!mahasiswaNim.includes(element.nim)) {
                mahasiswaNim.push(element.nim)
            }
        });
        const arrOfPromise = mahasiswaNim.map((singleData) =>
            students.findOne({
                where: {
                    nim: singleData
                }
            }).then(res => {
                if (!res) {
                    return null
                }
                return res
            })
        );
        const returnData = Promise.all(arrOfPromise).then((res) =>
            res.map((singleData) => {
                return singleData
            })
        );
        return returnData
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    searchByEmail,
    searchById,
    createCounselor,
    loginConselours,
    updateFcmToken,
    updateAvatar,
    getAllToken,
    updateJadwal,
    updateKetersediaan,
    getPerhari,
    getHistoryById,
    getReservationById,
    getMahasiswaYangDitangani
}
