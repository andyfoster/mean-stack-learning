angular.module('routerApp', [])

	// Create the controllers
	// This will be the controller for the ENTIRE site
	.controller('mainController', function() {
		var vm = this;

		// Create a bigMessage variable to display in our view
		vm.bigMessage = 'A smooth sea never make a skilled sailor.';
	})

		// Home page specific controller
		.controller('homeController', function() {
			var vm = this;

			vm.message = 'This is the home page';
		})

		// About Page Controller
		.controller('aboutController', function() {

			var vm = this;

			vm.message = 'Look! I am an about page!';
		})

		// Contact page controlller
		.controller('contactController', function() {

			var vm = this;

			vm.message = 'Contact Us! JK. This is just a demo';

		});