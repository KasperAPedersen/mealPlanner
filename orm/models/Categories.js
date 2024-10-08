// Mie

import { DataTypes } from "sequelize";
import sequelize from "../database.js";

let Categories = sequelize.define("Categories", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Categories;