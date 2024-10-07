import Router from 'express';

const route = new Router();

route.get('/logout', (req, res) => {
    if(req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/login');
})

export default route;