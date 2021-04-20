const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const router = express.Router();

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

router.post('/register', async (req, res) => {
	const result = await User.findOne({username: req.body.username}).select("_id").lean();
	console.log(result);
	
	if(result) {
		res.send("Username already taken");
	} else {
		try {
			const newuser = User({
				username: req.body.username,
				password: "$lul68skf" + req.body.passw + "helo_98bad123boi09"
			});
			
			newuser.save();
			
			req.session.loggedin = true;
		    req.session.user = req.body.username;
			
			res.send("Ok");
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	}

});

router.post('/login', async (req, res) => {
	try {
	  const result = await User.findOne({username: req.body.username, password: "$lul68skf" + req.body.passw + "helo_98bad123boi09"}).select("_id").lean();
	  console.log(result);
	  
	  if(result) {
		  req.session.loggedin = true;
		  req.session.user = req.body.username;
		  
		  res.send("Ok");
	  } else {
		  res.send("Bad");
	  }
	} catch (error) {
	  console.log(error);
	  res.sendStatus(500);
	}
});

router.get('/checklogin', async (req, res) => {
	
	if(req.session.loggedin) {
		res.send({user: req.session.user, loggedin: true});
	} else {
		res.send({loggedin: false});
	}
});

router.delete('/logout', async (req, res) => {
	if(req.session.loggedin) {
		req.session.destroy();
		res.sendStatus(200);
	} else {
		res.status(403).send({loggedin: false});
	}
});

module.exports = {
  routes: router,
  sesh: session,
  model: User
};