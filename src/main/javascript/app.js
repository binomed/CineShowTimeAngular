/* exported app */
'use strict';

var app = angular.module('cst', ['Cst.main', 'Cst.components']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/main',       { controller: 'CstCtrl',    templateUrl: 'partials/cineshowtime/main.html' })
    .when('/search',       { controller: 'SearchCtrl',    templateUrl: 'partials/cineshowtime/search.html' })
    ;
}]);