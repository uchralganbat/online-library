const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attribues = {
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        register: { type: DataTypes.STRING, allowNull: false },
        profession: {type: DataTypes.STRING, allowNull: false},
        phoneNumber: {type: DataTypes.STRING, allowNull: false}
    }
    return sequelize.define('Author', attribues, {timestamps: false});
}