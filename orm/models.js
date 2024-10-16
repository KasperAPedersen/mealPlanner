// Kasper, Mie & Anya

// Import the Sequelize instance (configured database connection) from the database.js file
import sequelize from './database.js';

// Import all the individual models representing different database tables/entities
import Accounts from './models/Accounts.js';
import Categories from './models/Categories.js';
import Ingredients from './models/Ingredients.js';
import Meals from './models/Meals.js';
import ShoppingLists from './models/ShoppingLists.js';
import ShoppingListItems from './models/ShoppingListItems.js';
import Units from './models/Units.js';

// Export all the models and the Sequelize instance as a single object
// This allows easy import of all models and the Sequelize instance elsewhere in the application
export default {
    sequelize, // Configured Sequelize instance (connected to the database)
    Accounts, // Accounts table model
    Categories, // Categories table model
    Ingredients, // Ingredients table model
    Meals, // Meals table model
    ShoppingLists, // ShoppingLists table model
    ShoppingListItems, // ShoppingListItems table model
    Units // Units table model
};