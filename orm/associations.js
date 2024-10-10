// Anya

import Ingredients from './models/Ingredients.js';
import Categories from './models/Categories.js';

Categories.hasMany(Ingredients, { foreignKey: 'category_id' });
Ingredients.belongsTo(Categories, { foreignKey: 'category_id' });
