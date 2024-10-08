import Models from '../orm/models.js';
import Router from 'express';
import BCrypt from 'bcrypt';

// Create a new instance of Router
const route = new Router();

// Handle /login GET request
route.get('/login', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('login.ejs');
});

route.post('/login', async (req, res) => {
    let username = req.body.name;
    let password = req.body.password;
    let email = req.body.email; // -ARK

    let accountDetails = await Models.Accounts.findOne({ where: { username: username } });
    if(!accountDetails) {
        req.flash("info", "User doesn't exist");
        res.render('login.ejs');
        return;
    }

    let accountEmail = await Models.Accounts.findOne({ where: { email: email } });
    if(!accountEmail) {
        req.flash("info", "User doesn't exist");
        res.render('login.ejs');
        return;
    }

    if(!await BCrypt.compare(password, accountDetails.dataValues.password)) {
        req.flash("info", "Password doesn't match");
        res.render('login.ejs');
        return;
    }

    req.session.loggedin = true;
    res.redirect('/');
});

export default route;