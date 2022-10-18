const firebaseAdmin = require('firebase-admin')


const firebaseApp = firebaseAdmin.initializeApp({
    credential : '../google-services.json',
})

module.exports = {
    firebaseApp
}
