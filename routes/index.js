// Kasper & Anya

// Import required modules
import Router from 'express';
import Models from '../orm/models.js';
import BCrypt from "bcrypt";
import { body, validationResult } from 'express-validator';

// Create a new instance of Router for defining routes
const route = new Router();

// Route to get ingredients by category name
route.get('/getIngredientsByCategory/:name', async (req, res) => {
    try {
        // Find category by name
        let categories = await Models.Categories.findOne({ where: { name: req.params.name } });
        if (!categories) {
            // If category not found, return 404 status
            return res.status(404).send('Category not found');
        }

        // Get category ID and find all ingredients belonging to that category
        let category_id = categories.dataValues.id;
        let items = await Models.Ingredients.findAll({ where: { category_id: category_id } });

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        res.send(items);
        res.end();
    } catch (error) {
        // Catch any errors and return a 500 status
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to render the home page, with session-based login status
route.get('/', async (req, res) => {
    res.render('index.ejs', {loggedin: req.session.loggedin});
});

// Route to handle login functionality
route.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Find user account by email
    let account = await Models.Accounts.findOne({where: {email: email}});
    if(!account) {
        // Flash a message if account doesn't exist and redirect to home
        req.flash("info", "User doesn't exist");
        res.redirect('/');
        return;
    }

    // Compare password with stored hashed password
    if(!await BCrypt.compare(password, account.dataValues.password)) {
        // Flash message if password is incorrect and redirect to home
        req.flash("info", "Incorrect password");
        res.redirect('/');
        return;
    }

    // Set session values if login successful
    req.session.loggedin = true;
    req.session.account_id = account.dataValues.id;
    res.redirect('/');
});

// Route to handle user registration, with input validation
route.post('/register', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('first_name').isAlpha().withMessage('Enter a valid first name'),
    body('last_name').isAlpha().withMessage('Enter a valid last name'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Flash first validation error message and redirect to home
        req.flash('info', errors.array()[0].msg);
        return res.redirect('/');
    }

    // Extract user inputs
    let { email, first_name, last_name, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
        req.flash("info", "Passwords don't match");
        return res.redirect('/');
    }

    // Check if user already exists
    let account = await Models.Accounts.findOne({where: {email: email}});
    if(account) {
        req.flash("info", "User already exists");
        return res.redirect('/');
    }

    // Create new user account with hashed and salted password
    account = await Models.Accounts.create({
        email: email,
        password: await BCrypt.hash(password, 10), // Hash and salt password with bcrypt
        first_name: first_name,
        last_name: last_name
    });

    // Set session for logged in user
    req.session.loggedin = true;
    req.session.account_id = account.dataValues.id;
    res.redirect('/');
});

// Route to handle logout, clearing the session
route.get('/logout', (req, res) => {
    if(req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/');
});

// Route to get all ingredients without filtering by category
route.get('/getAllIngredients', async (req, res) => {
    let ingredients = await Models.Ingredients.findAll();
    res.send(ingredients);
    res.end();
});

// Route to add a new shopping list
route.post('/addShoppingList', [
    body('name').notEmpty().withMessage('Shopping list name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
], async (req, res) => {
    // Check if user is logged in
    if (!req.session.loggedin) {
        return res.status(403).send('You must be logged in to perform this action');
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('info', errors.array()[0].msg); // Return first error
        return res.redirect('/');
    }

    let shoppingListName = req.body.name;

    // Create new shopping list associated with the logged-in user's account
    await Models.ShoppingLists.create({
        account_id: req.session.account_id,
        name: shoppingListName,
        status: 'active',
        date_due: new Date()
    });

    res.end();
});

// Route to get all shopping lists for the logged-in user
route.get('/getShoppingLists', async (req, res) => {
    // If not logged in, return empty list
    if(!req.session.loggedin) {
        res.send([]);
        return;
    }

    // Find and send all shopping lists belonging to the logged-in user
    let shoppingLists = await Models.ShoppingLists.findAll({where: {account_id: req.session.account_id}});
    res.send(shoppingLists);
    res.end();
});

// Route to add an ingredient to a shopping list
route.post('/addIngredientToShoppingList', [
    body('amount').isInt({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('unit').notEmpty().withMessage('Unit of measurement is required'),
    body('shoppingList').notEmpty().withMessage('Shopping list name is required'),
    body('ingredient_id').notEmpty().withMessage('Ingredient ID is required')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let amount = req.body.amount;
    let unit = req.body.unit;
    let shoppingListName = req.body.shoppingList;
    let ingredient_id = req.body.ingredient_id;

    // Find shopping list by name
    let shoppingList = await Models.ShoppingLists.findOne({ where: { name: shoppingListName } });
    if (!shoppingList) {
        return res.status(404).send('Shopping list not found');
    }

    // Find unit by name
    let getUnit = await Models.Units.findOne({ where: { name: unit } });
    if(!getUnit) {
        return res.status(400).send('Unit not found');
    }

    // Create new shopping list item entry
    await Models.ShoppingListItems.create({
        shopping_list_id: shoppingList.id,
        ingredient_id: ingredient_id,
        quantity: amount,
        unit: getUnit.id,
        purchased: 0
    });
    res.end();
});

// Route to get all units
route.get('/getAllUnits', async (req, res) => {
    let units = await Models.Units.findAll();
    res.send(units);
    res.end();
});

// Route to get all items for a specific shopping list by ID
route.get('/getshoppingListItems/:id', async (req, res) => {
   let shoppingListID = req.params.id;
   let shoppingListItems = await Models.ShoppingListItems.findAll({where: {shopping_list_id: shoppingListID}});

   let items = [];

    // Loop through shopping list items and fetch corresponding ingredient and unit details
    for(let i = 0; i < shoppingListItems.length; i++) {
        let ingredient = await Models.Ingredients.findOne({where: {id: shoppingListItems[i].ingredient_id}});
        let unit = await Models.Units.findOne({where: {id: shoppingListItems[i].unit}});
        items.push({
            id: shoppingListItems[i].id,
            name: ingredient.name,
            quantity: shoppingListItems[i].quantity,
            unit: unit.name,
            purchased: shoppingListItems[i].purchased
        })
    }
   res.send(items);
   res.end();
});

// Route to update the "purchased" status of a shopping list item
route.post('/updateShoppingListItem', async (req, res) => {
    let shoppingListItemID = req.body.shoppingListItemID;

    // Find the specific shopping list item by ID
    let shoppingListItem = await Models.ShoppingListItems.findOne({where: {id: shoppingListItemID}});
    if(!shoppingListItem) return;

    // Toggle the "purchased" status
    shoppingListItem.update({purchased: !shoppingListItem.purchased});
    res.end();
});

route.delete('/deleteShoppingList', async (req, res) => {
    let id = req.body.id;
    let shoppingList = await Models.ShoppingLists.findOne({where: {id: id}});
    if(!shoppingList) return;

    let shoppingListItems = await Models.ShoppingListItems.findAll({where: {shopping_list_id: shoppingList.id}});
    if (!shoppingListItems) return;

    for(let i = 0; i < shoppingListItems.length; i++) {
        await shoppingListItems[i].destroy();
    }

    await shoppingList.destroy();
    res.end();
});

// Export the route definitions for use in other parts of the application
export default route;