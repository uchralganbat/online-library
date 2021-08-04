const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initiliaze();

async function initiliaze() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({host, port, user, password});

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql'});

    db.Author = require('../models/author.model')(sequelize);
    db.Book = require('../models/book.model')(sequelize);
    db.Order = require('../models/order.model')(sequelize);
    db.University = require('../models/university.model')(sequelize);
    db.User = require('../models/user.model')(sequelize);
    db.Worker = require('../models/worker.model')(sequelize);

    // User -> Order User -> School        book -> Order book -> Author 
    
    
    db.Order.belongsTo(db.User, {
        foreignKey: 'fk_id_student'
    });
    db.Order.belongsTo(db.Book, {
        foreignKey: 'fk_id_book'
    });
    db.Book.belongsTo(db.Author, {
        foreignKey: 'fk_author_id'
    });
    db.User.belongsTo(db.University, {
        foreignKey: 'fk_id_university'
    });
    await sequelize.sync({alter: false});
}