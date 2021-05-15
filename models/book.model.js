const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        bookname: { type: DataTypes.STRING, allowNull: false },
        isbn: { type: DataTypes.STRING, allowNull: false},
        price: { type: DataTypes.STRING, allowNull: false},
        publishedDate: { type: DataTypes.DATE, allowNull: false},
        fk_author_id: { type: DataTypes.INTEGER, allowNull: false}
    }
    return sequelize.define('Book', attributes, { timestamps: false});
}