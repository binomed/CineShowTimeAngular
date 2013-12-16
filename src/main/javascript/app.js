/* exported app */
'use strict';

var app = angular.module('cst', ['ngRoute', 'ngAnimate','cst.main', 'cst.components']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/main',       { controller: 'CstCtrl',    templateUrl: 'partials/cineshowtime/main.html', direction:'lrt' })
    //.when('/fav',       { controller: 'FavCtrl',    templateUrl: 'partials/cineshowtime/fav.html' })
    //.when('/search',       { controller: 'SearchCtrl',    templateUrl: 'partials/cineshowtime/search.html' })
    //.when('/result',       { controller: 'ResultCtrl',    templateUrl: 'partials/cineshowtime/result.html' })
    .when('/movie',       { controller: 'MovieCtrl',    templateUrl: 'partials/cineshowtime/movie.html', direction:'rtl' })
    .otherwise({ redirectTo:  '/main' })
    ;
}]);