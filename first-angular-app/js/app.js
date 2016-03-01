// name our angular app
angular.module('firstApp', [])

.controller('mainController', function() {

	// bind this to VM (view-model)
	var vm = this;

	// define variables and objects on this
	// this lets them be available to our views

	// define a basic variable
	vm.message = 'Hey there. Come in!';

	// define he list of items
	vm.computers = [
		{ name: 'MacBook Pro', color: 'Silver', nerdness: 7 },
		{ name: 'Yoga 2 Pro', color: 'Grey', nerdness: 6 },
		{ name: 'Chromebook', color: 'Black', nerdness: 5 }
	];
});