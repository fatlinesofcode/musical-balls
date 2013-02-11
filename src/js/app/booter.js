var ROOT_PATH;
var App = {};
var Controllers = {};
var Config = {};
var app = angular.module('app', ['ngResource']);
// configure your app
//app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {
app.config(['$locationProvider',function ($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
}]);