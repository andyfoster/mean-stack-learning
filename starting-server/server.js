// load the express package and create our app
var express	=	require('express'),
		app			= express(),
		path 		= require('path');

// send our index.html file to the user for the home page
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'));
});


// create routes for the admin section

// get an instance of the router
var adminRouter = express.Router();


// route middleware that will happen on every request
// the order you place these is very important!!
adminRouter.use(function(req, res, next){

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing an go to the route
	next();
});


// admin main page. the dashboard (localhost:1337/admin)
adminRouter.get('/', function(req, res){
	res.send('I am the dashboard!');
});

// users page /admin/users
adminRouter.get('/users', function(req, res){
	res.send('I show all the users');
});

// posts page (admin/posts)
adminRouter.get('/posts', function(req, res){
	res.send('I show all the posts');
});

// apply the routes to our application
app.use('/admin', adminRouter);


// start the server
app.listen(1337);
console.log('1337 is the magic port');