const { firebaseApp } = require('./firebase_connection')
const serviceConselour = require('../repository/conselour')


//bikin function
const sendNotif = async (fcmToken, title, body) => {
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
    const tokensArr = []
    tokens.map((token) => {
        tokensArr.push(token)
    })
    return firebaseApp.messaging().sendMulticast({
        notification: {
            title: title,
            body: body,
        },
        tokens: tokensArr
    }).then(function (dataSendNotif) {
        return dataSendNotif
    }).catch(function (err) {
        console.log('notif error' + err)
        return null
    })
}

module.exports = {
    sendNotif,
    sendNotifToAll
}
