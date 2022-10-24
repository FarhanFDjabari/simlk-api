const {firebaseApp} = require('./firebase_connection')
const serviceConselour = require('../repository/conselour')


//bikin function
const sendNotif = (fcmToken, title, body, dataNotif) => {
    return firebaseApp.messaging().sendToDevice(fcmToken, {
        notification : {
            title : title,
            body : body,
        },
        data : dataNotif,
    }).then(function(dataSend){
        return dataSend
    }).catch(function(err){
        console.log(err)
        return null
    })
}

const sendNotifToAll = async (title, body, data) => {
    const dataConselour = serviceConselour.getAllToken().then(function(dataSend){
        return dataSend
    }).catch(function(err){
        console.log(err)
        return null
    })

    return firebaseApp.messaging().sendMulticast({
        notification : {
            title : title,
            body : body,
        },
        data : data,
        tokens : dataConselour.fcm_token
    }).then(function(dataSendNotif){
        return dataSendNotif
    }).catch(function(err){
        console.log(err)
        return null
    })
}

module.exports = {
    sendNotif,
    sendNotifToAll
}
