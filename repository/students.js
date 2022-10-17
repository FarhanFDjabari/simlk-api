const {students} = require('../model/entity_model')


const createStudents = (nim, name, major, profile_image_url, fcm_token) => {
    return students.create({
        nim : nim,
        name : name,
        major : major,
        role : 1,
        profile_image_url : profile_image_url,
        fcm_token : fcm_token
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return nil
    })
}

const deleteFcmToken = (nim) => {
    return students.update({
        fcm_token : null
    }, {
        where : {
            nim : nim
        }
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return nil
    })
}

const searchStudentByNimWithReservations = (nim) => {
    return students.findOne({
        where : {
            nim : nim
        },
        include : 'reservations'
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return nil
    })
}

const getProfile = (nim) => {
    return students.findOne({
        where : {
            nim : nim
        },
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return nil
    })
}

module.exports = {
    createStudents,
    deleteFcmToken,
    searchStudentByNimWithReservations,
    getProfile
}
