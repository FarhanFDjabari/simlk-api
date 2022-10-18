const {firebaseApp} = require('./firebase_connection')


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
        return err
    })
}
