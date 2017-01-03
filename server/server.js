'use strict';

require('./config/config');

const path = require('path');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const port = process.env.PORT;
const publicPath = path.join(__dirname, '../dist');

var app = express();
app.use(bodyParser.json());
app.use(express.static(publicPath));





app.get('*', (req, res)=>{
	res.send('connected to Fuel Control App');
	//res.render('index.html');
});

app.listen(port, ()=>{
	console.log(`Started on port ${port}`);
});

module.exports = {app};