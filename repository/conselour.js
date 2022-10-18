const {conselours} = require('../model/entity_model')



const searchByEmail = (email) => {
    return conselours.findOne({
        where : {
            email : email
        }
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return null
    })
}

const searchById = (id) => {
    return conselours.findOne({
        where : {
            id : id
        }
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return null
    })
}

const createCounselor = (name,email, password, major, profile_image_url, fcm_token) =>{
    return conselours.create({
        name : name,
        email : email,
        password : password,
        major : major,
        role : 0,
        profile_image_url : profile_image_url,
        fcm_token : fcm_token
    }).then(function(data){
        return JSON.stringify(data,null,2)
    }).catch(function(_error){
        return null
    })
}

module.exports = {
    searchByEmail,
    searchById,
    createCounselor
}
