const express = require('express');
const reservations = express.Router()
const response = require('../utils/response')
const studentsService = require('../repository/students')
const conselorService = require('../repository/conselour')
const jwt = require('../middleware/jwt_auth')
const { StatusCodes } = require('http-status-codes')






module.exports = {
    reservations
}
