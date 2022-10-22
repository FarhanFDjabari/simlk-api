const {firebaseApp} = require('./firebase_connection')
const serviceConselour = require('../repository/conselour')


//bikin function
const sendNotif = (fcmToken, title, body, data) => {
    firebaseApp.messaging().sendToDevice(fcmToken, {
        notification : {
            title : title,
            body : body,
        },
        data : data,
    }).then(function(data){
        return data
    }).catch(function(err){
        console.log(err)
        return null
    })
}

const sendNotifToAll = async (title, body, data) => {
    const data = serviceConselour.getAllToken().then(function(data){
        return data
    }).catch(function(err){
        console.log(err)
        return null
    })

    firebaseApp.messaging().sendMulticast({
        notification : {
            title : title,
            body : body,
        },
        data : data,
        tokens : data.fcmToken
    }).then(function(data){
        return data
    }).catch(function(err){
        console.log(err)
        return null
    })
}

module.exports = {
    sendNotif
}
