var app = angular.module('tinyurlApp', ['ngRoute', 'ngResource', 'chart.js', 'btford.socket-io'])
                 .factory('chartSocket', function (socketFactory) {
                            return socketFactory();
                   });



app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./public/views/home.html",
            controller: "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl: "./public/views/url.html",
            controller: "urlController"
        });
}).factory('chartSocket',['socketFactory', function(socketFactory) {
    return socketFactory();
}]);
