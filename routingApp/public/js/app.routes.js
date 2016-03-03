// Inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

	// Configure our routes
	.config(function($routeProvider, $locationProvider) {
		$routeProvider

			// Route for the home page
			.when('/', {
				templateUrl		: 'views/pages/home.html',
				controller		: 'homeController',
				controllerAs	: 'home' 
			})

			// Route for the about page
			.when('/about', {
				templateUrl		: 'views/pages/about.html',
				controller 		: 'aboutController',
				controllerAs	: 'about'
			})

			// Route for the contact page
			.when('/contact', {
				templateUrl		: 'views/pages/contact.html',
				controller		: 'contactController',
				controllerAs	: 'contact'
			});

		// Set our app up to have pretty URLs
		$locationProvider.html5Mode(true);
	});