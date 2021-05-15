const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const userService = require('../services/user.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.post('/order', authorize(), orderSchema, createOrder);
router.get('/', authorize(), getAll);
router.get('/schools', authorize(), getSchoolInfo);
router.get('/books', authorize(), showBooks);
router.get('/current', authorize(), getCurrent);
router.get('/orders', authorize(), showOrders);
router.get('/order/:id', authorize(), showOrdersByUser);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.delete('/order/:id', authorize(), _deleteOrder);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        age: Joi.string().required(),
        profession: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        fk_id_university: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function orderSchema(req, res, next) {
    console.log(req.user);
    const schema = Joi.object({
        date_shouldGive: Joi.date().required(),
        date_gave: Joi.date().empty(''),
        fk_id_book: Joi.number().required(),
        fk_id_student: Joi.number().required(),
        order_state: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function createOrder(req, res, next) {
    userService.createOrder(req.body)
        .then(() => res.json({ message: 'Order request successfully sent'}))
        .catch(next);
}

function showBooks(req, res, next) {
    userService.showBooks()
        .then(books => res.json(books))
        .catch(next);
}

function showOrders(req, res, next) {
    userService.showOrders()
        .then(orders => res.json(orders))
        .catch(next);
}
function getSchoolInfo(req, res, next) {
    userService.getSchoolInfo()
        .then(schools => res.json(schools))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function showOrdersByUser(req, res, next) {
    console.log(req.params.id);
    userService.showOrdersByUser(req.params.id)
        .then(orders => res.json(orders))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty(''),
        age: Joi.string().empty(''),
        profession: Joi.string().empty(''),
        phoneNumber: Joi.string().empty(''),
        fk_id_university: Joi.number().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

function _deleteOrder(req, res, next) {
    userService.deleteOrder(req.params.id)
        .then(() => res.json({message: 'Order deleted'}))
        .catch(next);
}
