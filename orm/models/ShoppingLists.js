// Mie

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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'deprecated', 'done'),
        defaultValue: 'active',
    },
    date_due: {
        type: DataTypes.DATE,
        allowNull: true,
    }
},
    {
    tableName: 'ShoppingLists',
    timestamps: true
});

export default ShoppingLists;