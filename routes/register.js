import Router from 'express';
import BCrypt from "bcrypt";
import Models from "../orm/models.js";

const route = new Router();

route.get('/register', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('register.ejs');
});

route.post('/register', async (req, res) => {
    let username = req.body.name;
    let password = req.body.password;
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;

    let accountDetails = await Models.Accounts.findOne({ where: { username: username } });
    if(accountDetails) {
        req.flash("info", "User already exist");
        res.render('register.ejs');
        return;
    }

    let hashedPassword = await BCrypt.hash(password, 10);

    accountDetails = await Models.Accounts.create({
        username: username,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName
    });

    if(!accountDetails) {
        req.flash("info", "Something went wrong");
        res.render('register.ejs');
        return;
    }

    req.session.loggedin = true;
    res.redirect('/');
});
export default route;