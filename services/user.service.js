const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    authenticate,
    getSchoolInfo,
    showBooks,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    showOrdersByUser,
    showOrders,
    createOrder,
    deleteOrder: _deleteOrder
};

async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    
    // authentication successful
    const token = jwt.sign({ id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username, age: user.age, phoneNumber: user.phoneNumber }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll({
        where: {},
        attributes: ['firstName', 'lastName'],
        include: [{
            model: db.University,
            where: {},
            attributes: ['name']
        }]
    });
}

async function getById(id) {
    return await db.User.findByPk(id,{
        include: [{
            model: db.University,
            attributes: ['name']
        }]
    });
}

async function getSchoolInfo() {
    return await db.University.findAll();
}

async function showBooks(){
    return await db.Book.findAll({
        include: [{
            model: db.Author,
            attributes: ['firstName']
        }]
    });
}

async function showOrders() {
    return await db.Order.findAll();
}

async function showOrdersByUser(id) {
    return await db.Order.findAll({
        where: { fk_id_student: id },
        include: [{
            model: db.User,
            attributes: ['firstName']
        }, {
            model: db.Book,
            attributes: ['bookname']
        }]
    });
}

async function createOrder(params){
    await db.Order.create(params);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    const user = await db.User.create(params);

    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function _deleteOrder(id) {
    const order = await db.Order.findByPk(id);
    if(!order) throw 'Order not found';
    await order.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}