const express = require('express');
const usersRouter = express.Router();
const _ = require('lodash');
//var passport = require('passport');
const {User} = require('../models/user');
//var Verify = require('./verify');
var {authenticate} = require('./../middleware/authenticate');


usersRouter.post('/',(req, res)=>{
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	
	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth', token).send(user);
	})
	.catch( (e)=> res.status(400).send(e));
});

usersRouter.get('/me', authenticate, (req, res)=>{
	res.send(req.user);
});

usersRouter.post('/login',(req, res)=>{
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			res.header('x-auth', token).send(user);
		});
	}).catch((e)=>{
		res.status(400).send();
	});
});

usersRouter.delete('/me/token', authenticate, (req, res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	}, ()=>{
		res.status(400).send();
	});
});

module.exports = {usersRouter};
