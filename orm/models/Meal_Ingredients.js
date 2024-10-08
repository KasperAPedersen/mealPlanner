//Mie

import {DataTypes} from "sequelize";
import sequelize from "../database.js";


const Meal_Ingredients = sequelize.define('Meal_Ingredient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    meal_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Meals,
            key: 'meal_id'
        },
        allowNull: false
    },
    ingredient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Ingredients,
            key: 'ingredient_id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false // Quantity for the specific ingredient in the meal
    },
    unit: {
        type: DataTypes.STRING, // E.g., kg, ml, g
        allowNull: true,
        references: {
            model: Units,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'meal_ingredients'
});

module.exports = Meal_Ingredients;
