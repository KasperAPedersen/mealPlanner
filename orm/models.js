import sequelize from './Database.js';

import Accounts from './models/account.js';
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