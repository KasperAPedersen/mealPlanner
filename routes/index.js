// Kasper & Anya

// Import required modules
import Router from 'express';
import Models from '../orm/models.js';
import BCrypt from "bcrypt";
import { body, validationResult } from 'express-validator';

// Create a new instance of Router
const route = new Router();

route.get('/getIngredientsByCategory/:name', async (req, res) => {
    try {
        let categories = await Models.Categories.findOne({ where: { name: req.params.name } });
        let category_id = categories.dataValues.id;
        let items = await Models.Ingredients.findAll({ where: { category_id: category_id } });

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        res.send(items);
        res.end();
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

route.get('/', async (req, res) => {
    res.render('index.ejs', {loggedin: req.session.loggedin}); // Render index page with session name
});

route.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let account = await Models.Accounts.findOne({where: {email: email}});
    if(!account) {
        req.flash("info", "User doesn't exist");
        res.redirect('/');
        return;
    }

    if(!await BCrypt.compare(password, account.dataValues.password)) {
        req.flash("info", "Incorrect password");
        res.redirect('/');
        return;
    }

    req.session.loggedin = true;
    req.session.account_id = account.dataValues.id;
    res.redirect('/');
});

route.post('/register', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('first_name').isAlpha().withMessage('Enter a valid first name'),
    body('last_name').isAlpha().withMessage('Enter a valid last name'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('info', errors.array()[0].msg); // Return first error
        return res.redirect('/');
    }

    let { email, first_name, last_name, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        req.flash("info", "Passwords don't match");
        return res.redirect('/');
    }

    let account = await Models.Accounts.findOne({where: {email: email}});
    if(account) {
        req.flash("info", "User already exist");
        return res.redirect('/');
    }

    account = await Models.Accounts.create({
        email: email,
        password: await BCrypt.hash(password, 10),
        first_name: first_name,
        last_name: last_name
    });

    req.session.loggedin = true;
    req.session.account_id = account.dataValues.id;
    res.redirect('/');
});

route.get('/logout', (req, res) => {
    if(req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/');
});

route.get('/getAllIngredients', async (req, res) => {
    let ingredients = await Models.Ingredients.findAll();
    res.send(ingredients);
    res.end();
});

route.post('/addShoppingList', [
    body('name').notEmpty().withMessage('Shopping list name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
], async (req, res) => {
    if (!req.session.loggedin) {
        return res.status(403).send('You must be logged in to perform this action');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('info', errors.array()[0].msg); // Return first error
        return res.redirect('/'); // Adjust this redirect according to your app's behavior
    }

    let shoppingListName = req.body.name;

    await Models.ShoppingLists.create({
        account_id: req.session.account_id,
        name: shoppingListName,
        status: 'active',
        date_due: new Date()
    });

    res.end();
});

route.get('/getShoppingLists', async (req, res) => {
    if(!req.session.loggedin) {
        res.send([]);
        return;
    }

    let shoppingLists = await Models.ShoppingLists.findAll({where: {account_id: req.session.account_id}});
    res.send(shoppingLists);
    res.end();
});

route.post('/addIngredientToShoppingList', [
    body('amount').isInt({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('shoppingList').notEmpty().withMessage('Shopping list name is required'),
    body('ingredient_id').notEmpty().withMessage('Ingredient ID is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let amount = req.body.amount;
    let unit = req.body.unit;
    let shoppingListName = req.body.shoppingList;
    let ingredient_id = req.body.ingredient_id;

    let shoppingList = await Models.ShoppingLists.findOne({ where: { name: shoppingListName } });
    if (!shoppingList) {
        return res.status(404).send('Shopping list not found');
    }

    let getUnit = await Models.Units.findOne({ where: { name: unit } });
    if(!getUnit) {
        return;
    }

    await Models.ShoppingListItems.create({
        shopping_list_id: shoppingList.id,
        ingredient_id: ingredient_id,
        quantity: amount,
        unit: getUnit.id,
        purchased: 0
    })
    res.end();
});

route.get('/getAllUnits', async (req, res) => {
    let units = await Models.Units.findAll();
    res.send(units);
    res.end();
});

route.get('/getshoppingListItems/:id', async (req, res) => {
   let shoppingListID = req.params.id;
   let shoppingListItems = await Models.ShoppingListItems.findAll({where: {shopping_list_id: shoppingListID}});

   let items = [];

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

route.post('/updateShoppingListItem', async (req, res) => {
    let shoppingListItemID = req.body.shoppingListItemID;

    let shoppingListItem = await Models.ShoppingListItems.findOne({where: {id: shoppingListItemID}});
    if(!shoppingListItem) return;

    shoppingListItem.update({purchased: !shoppingListItem.purchased});
    res.end();
});

export default route;