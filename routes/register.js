// Kasper & Anya
import Router from 'express';
import BCrypt from "bcrypt";
import Models from "../orm/models.js";

const route = new Router();

// Route to render the registration page
route.get('/register', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('register.ejs');
});

// Route to handle registration form submission
route.post('/register', async (req, res) => {
    let username = req.body.name;
    let password = req.body.password;
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let email = req.body.email;

    // Check if an account with the same username already exists
    let accountDetails = await Models.Accounts.findOne({ where: { username: username } });
    if(accountDetails) {
        req.flash("info", "User already exist");
        res.render('register.ejs');
        return;
    }

    // Hash the password before saving it to the database
    let hashedPassword = await BCrypt.hash(password, 10);

    // Create a new account with the provided details
    accountDetails = await Models.Accounts.create({
        username: username,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        email: email
    });

    if(!accountDetails) {
        req.flash("info", "Something went wrong");
        res.render('register.ejs');
        return;
    }

    // Log the user in and redirect them to the home page
    req.session.loggedin = true;
    res.redirect('/');
});
export default route;