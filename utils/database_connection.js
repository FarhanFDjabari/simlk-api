const { Sequelize } = require('sequelize');

const driver = process.env

const sequelize = new Sequelize(`postgres://postgres:${driver.DB_PASS}@${driver.DB_HOST}:${driver.DB_PORT}/postgres`);



module.exports =  {
    sequelize
}
