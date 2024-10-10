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
        res.redirect('/');
        return;
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

route.post('/addShoppingList', async (req, res) => {
    if(!req.session.loggedin) {
        return;
    }

    let shoppingListName = req.body.name;

    // validate

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
        return;
    }

    let shoppingLists = await Models.ShoppingLists.findAll({where: {account_id: req.session.account_id}});
    res.send(shoppingLists);
    res.end();
});

export default route;