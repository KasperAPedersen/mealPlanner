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

route.post('/register', async (req, res) => {
    let email = req.body.email;
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let password = req.body.password;
    let confirmedPassword = req.body.confirm_password;

    if(password !== confirmedPassword) {
        req.flash("info", "Passwords doesn't match");
        res.redirect('/');
        return;
    }

    // validate inputs


    let account = await Models.Accounts.findOne({where: {email: email}});
    if(account) {
        req.flash("info", "User already exist");
        res.redirect('/');
        return;
    }

    await Models.Accounts.create({
        email: email,
        password: await BCrypt.hash(password, 10),
        first_name: firstName,
        last_name: lastName
    });

    req.session.loggedin = true;
    res.redirect('/');
});

route.get('/logout', (req, res) => {
    if(req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/');
})

export default route;