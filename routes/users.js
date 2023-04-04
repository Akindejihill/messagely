const express = require('express');
const router = express.Router;
const ExpressError = require("../expressError");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { SECRET_KEY } = require('../config');


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', async function(req, res, next){
    try{
        let users = await User.all();
        return res.json({users});
    } catch (err) {
        return next(err);
    }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/ 
router.get('/:username', async function(req, res, next){
    try{
        let uname = req.param.username;
        let user = await User.get(uname);
        return res.json({user});
    } catch (err) {
        next(err);
    }
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', async function(req, res, next){
    try{
        let uname = req.params.username;
        let messages = await Users.messagesTo(uname);
        return res.json({messages});
    } catch (err) {
        return next(err);
    }
});


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', async function(req, res, next){
    try{
        let uname = req.params.username;
        let messages = await Users.messagesFrom(uname);
        return res.json({messages});
    } catch (err) {
        return next(err);
    }
});


module.exports = router;