// Kasper & Anya
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

// Handle /login POST request
route.post('/login', async (req, res) => {
    let usernameOrEmail = req.body.name; // Can be either username or email
    let password = req.body.password;

    // Check if the user exists based on either username or email
    let accountDetails = await Models.Accounts.findOne({
        where: {
            [Models.Sequelize.Op.or]: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        }
    })

    // If the account doesn't exist, show an error message
    if(!accountDetails) {
        req.flash("info", "User doesn't exist");
        res.render('login.ejs');
        return;
    }

    // Compare the password provided with the hashed password in the database
    if(!await BCrypt.compare(password, accountDetails.dataValues.password)) {
        req.flash("info", "Password doesn't match");
        res.render('login.ejs');
        return;
    }

    // Log the user in if everything is correct
    req.session.loggedin = true;
    res.redirect('/');
});

export default route;