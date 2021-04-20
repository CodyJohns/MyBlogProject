const express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
	secret: "aiwjdokdnfsld938skjdaf@%",
	resave: true,
	saveUninitialized: true
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/myblog', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const postSchema = new mongoose.Schema({
  user: String,
  message: String,
  date: String,
  likes: Number,
  category: String
});

// Create a model for items in the museum.
const Post = mongoose.model('Post', postSchema);

//creates a new post
app.post('/api/newpost', async (req, res) => {
  if(req.session.loggedin) {	
	  console.log("request to add a post!");
	  //creates a new db object with fields title and path.
	  
	  const post = new Post({
		user: req.session.user,
		message: req.body.message,
		date: req.body.timedate,
		likes: 0,
		category: req.body.category
	  });
	  
	  try {
		//saves item to db
		await post.save();
		
		res.sendStatus(200);
	  } catch (error) {
		console.log(error);
		res.sendStatus(500);
	  }
  } else {
	  res.send({loggedin: false});
  }
});

// Get a list of all of the posts from a certain category
app.get('/api/:cat', async (req, res) => {
  console.log("Request to get posts from " + req.params.cat);
  try {
    let posts = await Post.find({ category: req.params.cat }).sort({ _id: -1 });
	
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//likes post
app.post('/api/like/:id', async (req, res) => {
	console.log("Someone liked post: " + req.params.id);
	try {
		let posts = await Post.findOne({_id: req.params.id})
		
		posts.likes++;
		
		posts.save();
		
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//unlikes post
app.post('/api/unlike/:id', async (req, res) => {
	try {
		let posts = await Post.findOne({_id: req.params.id})
		
		posts.likes--;
		
		posts.save();
		
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//deletes a post
app.delete('/api/delete/:id', async (req, res) => {
	if(req.session.loggedin) {
		console.log("Someone deleted a post: " + req.params.id);
		
		try {
			await Post.deleteOne({_id: req.params.id});
			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	} else {
		res.send({loggedin: false});
	}
});

//updates field in db
app.put('/api/editp/:id', async (req, res) => {
	if(req.session.loggedin) {
		try {
			var item = await Post.findOneAndUpdate({_id: req.params.id}, {message: req.body.newmessage, date: req.body.timedate}, {upsert: true}, function(err, doc) {
				return res.sendStatus(200);
			});
			item.save();
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	} else {
		res.send({loggedin: false});
	}
});

// Schema for items
const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },
	user: String,
    message: String,
    date: String,
	upvotes: Number
});

// Model for items
const Comment = mongoose.model('Comment', commentSchema);

//creating comments
app.post('/api/comments/:postid/create', async (req, res) => {
	if(req.session.loggedin) {
		try {
			let posta = await Post.findOne({_id: req.params.postid});
			if (!posta) {
				res.send(404);
				return;
			}
			let comment = new Comment({
				post: posta,
				user: req.session.user,
				message: req.body.msg,
				date: req.body.datetime,
				upvotes: 0
			});
			await comment.save();
			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	} else {
		res.send({loggedin: false});
	}
});

//get number of comments for a post
app.get('/api/comments/:postid/num', async (req, res) => {
	try {
		let posta = await Post.findOne({_id: req.params.postid});
        if (!posta) {
            res.send(404);
            return;
        }
        let numc = await Comment.find({post: posta}).count(function(err, count){
			return count;
		});
		
		console.log(numc);
		
        res.send({num: numc});
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//get list of comments from post
app.get('/api/comments/:postid/getall', async (req, res) => {
    try {
        let posta = await Post.findOne({_id: req.params.postid});
        if (!posta) {
            res.send(404);
            return;
        }
        let comments = await Comment.find({post: posta});
        res.send(comments);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//deleting comments
app.delete('/api/comments/:postid/:commid', async (req, res) => {
	if(req.session.loggedin) {
		try {
			let comment = await Comment.findOne({_id:req.params.commid, post: req.params.postid});
			if (!comment) {
				res.send(404);
				return;
			}
			await comment.delete();
			
			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	} else {
		res.send({loggedin: false});
	}
});

const auth = require("./auth.js");
app.use("/api/auth", auth.routes);

app.listen(3000, () => console.log('Server listening on port 3000!'));
