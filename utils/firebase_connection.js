const firebaseAdmin = require('firebase-admin')
const googleService = require('../simpl-k-firebase-adminsdk-e35ux-5b2560bd6d.json')

const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(googleService),
})

module.exports = {
    firebaseApp
}
