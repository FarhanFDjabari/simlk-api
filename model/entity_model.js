const { DataTypes } = require("sequelize");
const {sequelize} = require ("../utils/database_connection");


const students = sequelize.define('students', {
    nim : {
        type : DataTypes.TEXT,
        allowNull : false,
        primaryKey : true
    },
    name : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    major : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    role : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    profile_image_url : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    fcm_token : {
        type : DataTypes.TEXT,
        allowNull : true
    }
})

const conselours = sequelize.define('conselours', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    name : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    major : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    role : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    profile_image_url : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    fcm_token : {
        type : DataTypes.TEXT,
        allowNull : true
    }
})

const reservations = sequelize.define('reservations', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    nim : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    reservation_time : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    status : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    description : {
        type : DataTypes.TEXT
    },
    report : {
        type : DataTypes.TEXT
    }
})

students.hasMany(reservations,{
    foreignKey : 'nim',
    as : 'reservations'
})

module.exports =  {
    reservations,
    conselours,
    students
}
