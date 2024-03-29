const { sequelize } = require('./utils/database_connection')
const { auth } = require('./controller/auth')
const { students } = require('./controller/student')
const { reservationsSchedule } = require('./controller/reservation_schedules')
const { reservationsStatus } = require('./controller/reservation_status');
const { conselour } = require('./controller/konselor');
const { reservationsStudent } = require('./controller/reservation_students');
const { reservationsHistory } = require('./controller/reservation_history');
const { pengawasController } = require('./controller/pengawas')
const { notifications } = require('./controller/notifications');
const { koordinatorController } = require('./controller/koordinator');

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const uploadExpress = require('express-fileupload');

dotenv.config()

sequelize.sync({ alter: true });

const app = express()

app.use(uploadExpress({
    limits: 3 * 1024 * 1024
}))

app.use(
    cors({
        //array of allowed origins
        origin: [
            "*",
        ],
        credentials: true,
        methods: "GET,POST,DELETE,PUT,PATCH",
        crossDomain: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With",
            "X-HTTP-Method-Override",
        ],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());


app.get('/test', async (req, res) => {
    res.status(200).json({
        text: "Hello World",
    })
})
app.use('/auth', auth)
app.use('/mahasiswa', students)
app.use('/reservation-schedules', reservationsSchedule)
app.use('/reservation-status', reservationsStatus)
app.use('/konselor', conselour)
app.use('/reservation-mahasiswa', reservationsStudent)
app.use('/reservation-history', reservationsHistory)
app.use('/notifications', notifications)
app.use('/pengawas', pengawasController)
app.use('/koordinator', koordinatorController)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})



