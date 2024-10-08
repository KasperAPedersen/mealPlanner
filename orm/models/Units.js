// Mie & Kasper

import {DataTypes} from "sequelize";
import sequelize from "../database.js";


const Units = sequelize.define('Units', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        maxValue: 50
    }
}, {
    timestamps: false,
    tableName: 'Units'
});

export default Units;
