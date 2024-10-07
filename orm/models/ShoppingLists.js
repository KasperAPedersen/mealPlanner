import {DataTypes} from "sequelize";
import sequelize from "../database.js";


const ShoppingLists = sequelize.define('ShoppingList', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Accounts',
            key: 'id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('active', 'deprecated', 'done'),
        defaultValue: 'active',
    },
    date_due: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

export default ShoppingLists;