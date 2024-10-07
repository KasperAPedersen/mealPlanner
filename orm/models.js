import sequelize from './database.js';

import Accounts from './models/Accounts.js';
import Categories from './models/Categories.js';
import Ingredients from './models/Ingredients.js';
import Meals from './models/Meals.js';
import ShoppingLists from './models/ShoppingLists.js';
import ShoppingListItems from './models/ShoppingListItems.js';

export default {
    sequelize,
    Accounts,
    Categories,
    Ingredients,
    Meals,
    ShoppingLists,
    ShoppingListItems,
};