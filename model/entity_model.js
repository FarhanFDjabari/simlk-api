const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database_connection");

// 3
const students = sequelize.define('mahasiswa', {
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
        allowNull: false,
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
    email: {
        type: DataTypes.TEXT
    },
    dpa: {
        type: DataTypes.TEXT,
    },
    fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})


// 2
const conselours = sequelize.define('konselor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
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
    no_hp: {
        type: DataTypes.TEXT,

    },
    id_line: {
        type: DataTypes.TEXT,
    },
    profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_available : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    jadwal : {
        type : DataTypes.TEXT
    }
})


// 0
const pengawas = sequelize.define('pengawas', {
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


// 1
const koordinator = sequelize.define('koordinator', {
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
    nim : {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull : true
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

const reservations = sequelize.define('reservation', {
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
    location: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    file_report: {
        type: DataTypes.TEXT
    },
    id_conselour: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    model : {
        type: DataTypes.INTEGER,
    }
})

const notificationsStudent = sequelize.define('notification_mahasiswa', {
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
    is_read: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    id_reservasi: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
})

const notificationsConselour = sequelize.define('notification_konselor', {
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
    is_read: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    id_reservasi: {
        type: DataTypes.INTEGER
    },
    model : {
        type : DataTypes.INTEGER
    },
    id_konselor : {
        type : DataTypes.INTEGER
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

reservations.belongsTo(students, {
    foreignKey: 'nim',
    as: 'student'
})



module.exports = {
    reservations,
    conselours,
    students,
    notificationsConselour,
    notificationsStudent,
    koordinator,
    pengawas
}
