const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const {User} = require('./../../models/user');

const UserOneId = new ObjectID();
const UserTwoId = new ObjectID();

const users = [{
	_id: UserOneId,
	email: 'andres@vt.com',
	password: 'userOnePass',
	tokens:[{
		access: 'auth',
		token: jwt.sign({_id:UserOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
},{
	_id: UserTwoId,
	email: 'carolina@vt.com',
	password: 'userTwoPass' ,
		tokens:[{
		access: 'auth',
		token: jwt.sign({_id:UserTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];



const populateUsers = (done)=>{
	
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();
		return Promise.all([userOne, userTwo]);

	}).then(()=>done());
};

module.exports = {users, populateUsers};