// load the express package and create our app
var express	=	require('express'),
		app			= express(),
		path 		= require('path');


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


// send our index.html file to the user for the home page
app.get('/', function(req,res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});


// create routes for the admin section

// get an instance of the router
var adminRouter = express.Router();


// route middleware that will happen on every request
// the order you place these is very important!!
adminRouter.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();
});


// admin main page. the dashboard (localhost:1337/admin)
adminRouter.get('/', function(req, res) {
	res.send('I am the dashboard!');
});

// users page (/admin/users)
adminRouter.get('/users', function(req, res) {
	res.send('I show all the users');
});

// posts page (admin/posts)
adminRouter.get('/posts', function(req, res) {
	res.send('I show all the posts');
});

// route with parameters (http://localhost:1337/admin/users/:name)
adminRouter.get('/users/:name', function(req, res) {
	res.send('Hello, ' + req.params.name + '!');
});

// route middleware to validate :name
adminRouter.param('name', function(req, res, next, name) {
	// Do validation on name here
	// Log something to make sure it's working
	console.log('doing name validations on ' + name);

	// Once validation is done, save the new item in the req
	req.name = name;

	// Go to the next thing
	next();
});

adminRouter.get('/hello/:name', function(req, res) {
	res.send('Well, Helllllooo ' + req.name.capitalize() + '!');
});


// apply the routes to our application
app.use('/admin', adminRouter);


app.route('/login')

	// show the form (GET /login)
	.get(function(req, res) {
		res.send('this is the login form');
	})

	// process the form (POST /login)
	.post(function(req, res) {
		console.log('call to POST. processing... (look busy)');
		res.send('processing the login form!');
	})

	.put(function(req, res) {
		res.send('updating something...');
	})

	.lock(function(req, res) {
		res.send('locking it down!!!');
	});

// start the server
app.listen(1337);
console.log('1337 is the magic port');