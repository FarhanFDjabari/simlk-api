const {sequelize} = require('./utils/database_connection')
const {students, reservations} = require('./model/entity_model')


sequelize.sync({})

// students.create({
//     nim : "215150201111007",
//     name : "aditya rizky ramadhan",
//     major : "TIF",
//     role : 1,
//     profile_image_url : "link",
//     fcm_token : null
// })

// reservations.create({
//     nim : '215150201111007',
//     reservation_time : '17-10-2022 21:00',
//     status : 1,
//     description : 'bla bla'
// })
// students.findAll({
//     where : {
//         nim : '215150201111007',
//     },
//     include : 'reservations'
// }).then(function(data){
//     console.log(JSON.stringify(data, null, 2))
// }).catch(function(err){
//     console.log(err)
// })



