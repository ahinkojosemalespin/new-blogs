var blogsApp = angular.module('blogsApp', [
  'ngRoute',
  'blogsAppControllers'
]);
 
blogsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/blogs', {
        templateUrl: 'views/blogs.ejs',
        controller: 'blogsController'
      }).
      when('/tags', {
        templateUrl: 'views/tags.ejs',
        controller: 'tagsController'
      }).
      when('/authors', {
        templateUrl: 'views/authors.ejs',
        controller: 'authorsController'
      }).
      otherwise({
        redirectTo: '/blogs'
      });
  }]);

var blogsAppControllers = angular.module('blogsAppControllers', []);
 
