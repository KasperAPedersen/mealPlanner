// Kasper
import Models from './models.js';

let insertDummyData = async () => {
    try {
        await Models.Accounts.create({
            email: 'swp@swp.dk',
            password: 'swp',
            first_name: 'swp',
            last_name: 'swp'
        });

        await Models.Categories.bulkCreate([
            { name: 'Vegetables' },
            { name: 'Fish' },
            { name: 'Meat' },
            { name: 'Soup' },
            { name: 'Dessert' }
        ]);

        await Models.Ingredients.bulkCreate([
            { category_id: 1, name: 'Tomato' },
            { category_id: 1, name: 'Cucumber' },
            { category_id: 2, name: 'Salmon' },
            { category_id: 2, name: 'Tuna' },
            { category_id: 1, name: 'Tofu' },
            { category_id: 1, name: 'Seitan' },
            { category_id: 3, name: 'Chicken' },
            { category_id: 3, name: 'Beef' },
            { category_id: 4, name: 'Carrot Soup' },
            { category_id: 4, name: 'Tomato Soup' },
            { category_id: 5, name: 'Chocolate Cake' },
            { category_id: 5, name: 'Ice Cream' }
        ]);

        await Models.Units.bulkCreate([
            { name: 'g' },
            { name: 'kg' },
            { name: 'l' },
            { name: 'ml' },
            { name: 'pcs' }
        ]);
    } catch (e) {
        console.error('Error inserting dummy data: ', e);
    }
}

export default insertDummyData;