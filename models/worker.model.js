const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        lastName : { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        shift: { type: DataTypes.STRING, allowNull: false }
    }

    return sequelize.define('Worker', attributes, { timestamps: false });
}