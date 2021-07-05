const config = {
    dbName: 'SQLProperty',
    dbUser: 'root',
    dbPass: 'Admin@123',
    conn:{
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
    }
}
}
module.exports = config