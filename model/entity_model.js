const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database_connection");


const students = sequelize.define('students', {
    nim: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    major: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    no_hp: {
        type: DataTypes.TEXT,

    },
    id_line: {
        type: DataTypes.TEXT,
    },
    email : {
        type : DataTypes.TEXT
    },
    dpa: {
        type: DataTypes.TEXT,
    },
    fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

const conselours = sequelize.define('conselours', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    major: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

const reservations = sequelize.define('reservations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nim: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reservation_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time_hours: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    report: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location : {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type : {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

const notificationsStudent = sequelize.define('notifications_student', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nim: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT
    },
    body: {
        type: DataTypes.TEXT
    },
    data: {
        type: DataTypes.TEXT
    },
    is_read : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
})

const notificationsConselour = sequelize.define('notifications_conselour', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT
    },
    body: {
        type: DataTypes.TEXT
    },
    data: {
        type: DataTypes.TEXT
    },
    is_read : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
})

students.hasMany(reservations, {
    foreignKey: 'nim',
    as: 'reservations'
})

students.hasMany(notificationsStudent, {
    foreignKey: 'nim',
    as: 'notifications_student'
})

module.exports = {
    reservations,
    conselours,
    students,
    notificationsConselour,
    notificationsStudent
}
