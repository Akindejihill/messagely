const express = require('express');
const ExpressError = require("../expressError");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { SECRET_KEY } = require('../config');

const router = express.Router;

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function(req, res, next){
    try{
        let username = req.body.username;
        let password = req.body.password;
        verified = await User.authenticate(username, password)
        if (verified) 
        {
            User.updateLoginTimestamp(username);
            let payload = req.body.username;
            let token = jwt.sign(payload, SECRET_KEY);
            return res.json({token});
        }
    } catch (err){
        return next(err);
    }

});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async function(req, res, next){
    try{
        let {username} = await User.register(req.body);
        User.updateLoginTimestamp(username);
        let token = jwt.sign(payload, SECRET_KEY);
        return res.json({token});
    } catch (err) {
        return next(err);
    }
});


module.exports = router;