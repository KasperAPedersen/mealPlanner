// Kasper

// Import required modules
import Router from 'express';
import Models from '../orm/models.js';

// Create a new instance of Router
const route = new Router();

route.get('/', async (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    res.render('index.ejs'); // Render index page with session name
});

export default route;