// Kasper & Anya
import Router from 'express'; // Express router to define routes
import BCrypt from "bcrypt";  // Bcrypt for password hashing
import Models from "../orm/models.js";  // ORM models for database interaction

const route = new Router();

// Route to render the registration page
route.get('/register', (req, res) => {
    // If the user is already logged in, redirect them to the home page
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }
    // Render the registration page using EJS template engine
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

    // Hash and salt the password before saving it to the database
    let hashedPassword = await BCrypt.hash(password, 10);

    // Create a new account with the provided details
    accountDetails = await Models.Accounts.create({
        username: username,
        password: hashedPassword, // Stores the hashed password
        first_name: firstName,
        last_name: lastName,
        email: email
    });

    // If account creation fails, flash a message and re-render the registration page
    if(!accountDetails) {
        req.flash("info", "Something went wrong");
        res.render('register.ejs');
        return;
    }

    req.session.loggedin = true; // Log the user in and redirect them to the home page
    res.redirect('/'); // Redirect the user to the home page
});
export default route;