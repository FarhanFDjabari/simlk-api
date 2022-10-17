const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:dqBcTXKBKz2liFpd@db.sjdijscmtkwnljhhfeuu.supabase.co:5432/postgres');



module.exports =  {
    sequelize
}
