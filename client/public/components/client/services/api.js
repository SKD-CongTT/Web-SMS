client.factory('api', ['$http', function($http) { 
    return $http.get('http://localhost:8000/courses.json') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);
