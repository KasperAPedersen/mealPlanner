// Kasper

// Import required modules
import Router from 'express';
import Models from '../orm/models.js';
import BCrypt from "bcrypt";

// Create a new instance of Router
const route = new Router();

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
    res.redirect('/');
});

export default route;