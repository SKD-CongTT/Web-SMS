client.factory('api', ['$http', function($http) { 
    return $http.get('http://localhost/credit_students/') 
    .success(function(data) { 
        return data; 
    }) 
    .error(function(err) { 
        return err; 
    }); 
}]);
