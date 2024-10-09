//Mie

import {DataTypes} from "sequelize";
import sequelize from "../database.js";

let Ingredients = sequelize.define("Ingredients", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "Ingredients",
    timestamps: true
});

export default Ingredients;