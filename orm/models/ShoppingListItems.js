import {DataTypes} from "sequelize";
import sequelize from "../database.js";

const ShoppingListItems = sequelize.define('ShoppingListItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shopping_list_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ShoppingLists',
            key: 'id',
        },
    },
    ingredient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Ingredients',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purchased: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default ShoppingListItems;