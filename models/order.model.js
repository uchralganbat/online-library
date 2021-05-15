const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        date_shouldGive: { type: DataTypes.DATE, allowNull: false },
        date_gave: { type: DataTypes.DATE, allowNull: true },
        fk_id_book: { type: DataTypes.INTEGER, allowNull: false },
        fk_id_student: { type: DataTypes.INTEGER, allowNull: false },
        order_state: { type: DataTypes.INTEGER, allowNull: false }
    }
    return sequelize.define('Order', attributes, { updatedAt: false });
}