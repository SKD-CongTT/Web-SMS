client.directive('course', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    },
    templateUrl: 'public/components/client/directives/course.html' 
  }; 
});