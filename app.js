// Kasper
import indexRoute from './routes/index.js';

import Express from 'express';
import Session from 'express-session';
import Flash from 'express-flash';
import DotEnv from 'dotenv';

DotEnv.config();
let app = new Express();

app.set('view engine', 'ejs');
app.use(Express.json());
app.use(Express.static('views'));
app.use(Express.urlencoded({extended: true}));
app.use(Session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(Flash());

app.use(indexRoute);

app.listen(process.env.PORT, (e) => {
    console.log(e ? e : `[CON]\t\tListening on port ${process.env.PORT}`);
});