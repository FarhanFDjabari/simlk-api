const { firebaseApp } = require('./firebase_connection')
const serviceConselour = require('../repository/conselour')


//bikin function
const sendNotif = (fcmToken, title, body) => {
    const tokens = []
    tokens.push(fcmToken)
    console.log(fcmToken)
    return firebaseApp.messaging().sendMulticast({
        notification: {
            title: title,
            body: body,
        },
        tokens: tokens
    }
    ).then(function (dataSend) {
        console.log(dataSend)
        return dataSend
    }).catch(function (err) {
        console.log(err)
        return null
    })
}

const sendNotifToAll = async (title, body, tokens) => {

    return firebaseApp.messaging().sendMulticast({
        notification: {
            title: title,
            body: body,
        },
        tokens: tokens
    }).then(function (dataSendNotif) {
        return dataSendNotif
    }).catch(function (err) {
        console.log(err)
        return null
    })
}

module.exports = {
    sendNotif,
    sendNotifToAll
}
