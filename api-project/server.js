// BASE SETUP
// ====================

// CALL THE PACKAGES
var express			= require('express'); // call express
var app					= express(); // define our app using express
var bodyParser	= require('body-parser'); // pull content from http requests
var morgan			= require('morgan'); // log requests
var mongoose		= require('mongoose'); // for working w/ our database
var jwt 				= require('jsonwebtoken');
var User 				= require('./app/models/user');
var port				= process.env.PORT || 8080; // set the port for our app
mongoose.connect('mongodb://localhost:27017/api-database');

var superSecret = 'thisismysecretsecret';

// APP CONFIGURATION -------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});


// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// =========
var apiRouter = express.Router();


// route for authenticating users
apiRouter.post('/authenticate', function(req, res) {

	// find the user
	// select the name, username, and password explicity
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {
		if (err) throw err;

		// no user with that username was found
		if (!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user) {

			// check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password'
				});
			} else {
				// if user is found and password is right
				// create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token',
					token: token
				});
			}
		}
	});
});

// MIDDLEWARE =======

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
	// do logging
	console.log('Somebody just came to our app with the IP of ' + req.connection.remoteAddress);

	// we'll add more to the middleware in Chapter 10
	// this is where we will authenticate users

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {
		jwt.verify(token, superSecret, function(err, decoded) {
			if (err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;

				next();
			}
		});
	} else {
		// if there is no token
		// return an HTTP response of 403 (access forbidden) and an error message
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}

	// next() used to be here
});

// test route to make sure everything is working
// access at GET /api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

apiRouter.route('/users')

		// create a user (POST /api/users)
		.post(function(req, res) {

				// create a new instance of the User model
				var user = new User();

				// create a new instance of the User model
				user.name 			= req.body.name;
				user.username 	= req.body.username;
				user.password		= req.body.password;

				// save the user and check for errors
				user.save(function(err) {
					if (err) {
						// duplicate entry
						if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists!' });
					  else
					  	return res.send(err);
					}
					res.json({ message: 'User created!' });
			});
		})

		// get all users (GET /api/users)
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

apiRouter.route('/users/:user_id')

	// show the info for a specific user (GET /users/{ID})
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// return that user
			res.json(user);
		});
	})

	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) return res.send(err);

			res.json({ message: 'Successfully deleted' });
		});

		// User.findById(req.params.user_id, function(err, user) {
		// 	if (err) res.send(err);

		// 	user.remove(function(err) {
		// 		if (err) res.send(err);

		// 		res.json({ message: 'User deleted!' });
		// 	});
		// })
	})

	// update user with this id
	// (PUT /api/users/{ID})
	.put(function(req, res) {
		// use our user model to find the user we want
		User.findById(req.params.user_id, function(err, user) {

			if (err) res.send(err);

			// update te users info only if its new
			if (req.body.name) 		 user.name 			= req.body.name;
			if (req.body.username) user.username	= req.body.username;
			if (req.body.password) user.password	= req.body.password;

			// save the user
			user.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.json({ message: 'User updated!' });
			});

		})
	});

// API endpoint to get user information
apiRouter.get('/me', function(req, res) {
	res.send(req.decoded);
});


// more routes will happen here

// REGISTER ALL OUR ROUTES
// all of our routes will be prefixes with /api
app.use('/api', apiRouter);

// START THE SERVER
// ====================
app.listen(port);
console.log('Magic happens on port ' + port);

