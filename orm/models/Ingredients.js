import {DataTypes} from "sequelize";
import sequelize from "../database.js";

let Ingredients = sequelize.define("Ingredients", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id',
        },
    }
}, {
    tableName: "Ingredients",
    timestamps: false
});

export default Ingredients;