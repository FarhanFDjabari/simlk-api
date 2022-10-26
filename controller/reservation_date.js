const express = require('express');
const reservationsDate = express.Router()
const response = require('../utils/response')
const reservationsService = require('../repository/reservations')
const studentsService = require('../repository/students')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')

reservationsDate.get('/konselor', jwt.validateToken, async (req, res) => {

})

reservationsDate.get('/mahasiswa', jwt.validateToken, async (req, res) => {

})

