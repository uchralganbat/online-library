const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        city: { type: DataTypes.STRING, allowNull: false },
        street: { type: DataTypes.STRING, allowNull: false },
        zip_code: { type: DataTypes.STRING, allowNull: false }
    };

    return sequelize.define('University', attributes, {timestamps: false});
}