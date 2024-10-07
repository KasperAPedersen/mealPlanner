import {DataTypes} from "sequelize";
import sequelize from "../database.js";
import Meals from "./Meals.js";
import Ingredients from "./Ingredients.js";


const Meal_Ingredients = sequelize.define('Meal_Ingredient', {
    meal_ingredient_id: {
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
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'meal_ingredients'
});

// Establishing the relationships
Meals.belongsToMany(Ingredients, { through: Meal_Ingredients, foreignKey: 'meal_id' });
Ingredients.belongsToMany(Meals, { through: Meal_Ingredients, foreignKey: 'ingredient_id' });

module.exports = Meal_Ingredients;
