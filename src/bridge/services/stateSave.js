var angular = require('angular');

var app = angular.module('bridge.services');

app.factory('stateSave', ['$resource', function ($resource) {
        var data = $resource('/simulations');
        console.log('testing, good');
    

    }]);
