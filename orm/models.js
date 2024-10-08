// Kasper, Mie & Anya

import sequelize from './database.js';
import { Sequelize } from 'sequelize'; // Import Sequelize class

import Accounts from './models/Accounts.js';
import Categories from './models/Categories.js';
import Ingredients from './models/Ingredients.js';
import Meals from './models/Meals.js';
import ShoppingLists from './models/ShoppingLists.js';
import ShoppingListItems from './models/ShoppingListItems.js';
import Units from './models/Units.js';

export default {
    Sequelize, // class
    sequelize,
    Accounts,
    Categories,
    Ingredients,
    Meals,
    ShoppingLists,
    ShoppingListItems,
    Units
};