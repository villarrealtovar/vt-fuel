require('./config/config');

const path = require('path');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');

const port = process.env.PORT;
const publicPath = path.join(__dirname, '../dist');

var app = express();
var {usersRouter} = require('./routes/users');

app.use(bodyParser.json());
app.use(express.static(publicPath));
app.set('views', __dirname + '../dist/');

app.use('/users', usersRouter);

app.get('*', (req, res)=>{
	//res.send('connected to Fuel Control App');
	res.render('index.html');
});

app.listen(port, ()=>{
	console.log(`Started on port ${port}`);
});

module.exports = {app};
