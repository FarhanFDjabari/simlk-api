const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');


dotenv.config('../.env')

const driver = process.env

const sequelize = new Sequelize(`postgres://postgres:${driver.DB_PASS}@${driver.DB_HOST}:${driver.DB_PORT}/postgres`)

module.exports =  {
    sequelize
}
