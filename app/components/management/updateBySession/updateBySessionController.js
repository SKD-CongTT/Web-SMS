// angular.module('webix')
//     .controller('reportsController',function ($scope,$rootScope,$http,auth,$mdToast,$mdDialog) {
//         if(auth.isAuthed()){
//             $scope.selected = false;
//             $scope.filtedStudentsss = [];
//             $scope.saveRowCallback = function(row){
//
//                 console.log(row[5]);
//                 if (row[5] > 10 || row[5] < 0)
//                     row[5] = 0;
//                 $mdToast.show(
//                     $mdToast.simple()
//                         .content('Row changed to: '+row)
//                         .hideDelay(3000)
//                 );
//             };
//             var getSession = function () {
//                 if (auth.isAuthed()){
//                     if ($rootScope.sessions.length === 0)
//                         $http.get($rootScope.apiUrl + "/sessions/?limit=1000").then(function (response) {
//                             $rootScope.sessions = response.data.results;
//                         });
//                 }
//                 else{
//                     alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
//                     auth.logout();
//                 }
//             };
//             getSession();
//             $scope.myFunction = function(){
//                 console.log(document.getElementById("myInput").value);
//                 $scope.filtedStudentsss = [];
//             };
//             $scope.getStudentBySession = function (value) {
//                 $scope.selected = true;
//                 $scope.loadingStudent = true;
//                 var url = '/sessions/list_student_by_session/?session_id=' +  value.id + '&';
//                 if (auth.isAuthed()){
//                     $http.get($rootScope.apiUrl + url + "limit=1000").then(function (response) {
//                         $scope.students = response.data;
//                         if (value === 'all') {
//                             $scope.students = response.data.results;
//                         }
//                         for (var i = 0; i < $scope.students.length; i++){
//                             $scope.students[i].year = Math.floor(2018 - $scope.students[i].username/10000);
//                             $scope.students[i].ids =  $scope.students[i].id;
//                         }
//                         $scope.students.sort(function(a, b){
//                             if (a.id < b.id) //sort string ascending
//                                 return -1 ;
//                             if (a.id > b.id)
//                                 return 1;
//                             return 0; //default return value (no sorting)
//                         });
//                         $rootScope.filtedStudents = $scope.students;
//                         $scope.filtedStudentsss = $rootScope.filtedStudents;
//                         $scope.loadingStudent = false;
//                     });
//                 }
//                 else{
//                     alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
//                     auth.logout();
//                 }
//             };
//         } else {
//             alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
//             auth.logout();
//         }
//     });
angular.module("webix").controller("updateBySessionController", updateBySessionController);
updateBySessionController.$inject = ["NgTableParams", "auth", "$rootScope", "$scope", "$http", "$mdToast"];

function updateBySessionController(NgTableParams, auth, $rootScope, $scope, $http, $mdToast) {
    var self = this;
    var simpleList = [
    ];
    var originalData = angular.copy(simpleList);

    self.tableParams = new NgTableParams({}, {
        dataset: angular.copy(simpleList)
    });

    self.deleteCount = 0;

    self.add = add;
    self.cancelChanges = cancelChanges;
    self.del = del;
    self.hasChanges = hasChanges;
    self.saveChanges = saveChanges;
    self.getStudentBySession = getStudentBySession;
    self.saveScore = saveScore;

    $scope.selected_session = 0;
    $scope.loading = false;
    //////////
    var getSession = function () {
        if (auth.isAuthed()){
            if ($rootScope.sessions.length === 0)
                $http.get($rootScope.apiUrl + "/sessions/?limit=1000").then(function (response) {
                    $rootScope.sessions = response.data.results;
                });
        }
        else{
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }
    };
    getSession();
    function getStudentBySession(value) {
        $scope.selected = true;
        $scope.loading = true;
        $scope.selected_session = value.id;
        var url = '/sessions/list_student_by_session/?session_id=' +  value.id + '&';
        if (auth.isAuthed()){
            $http.get($rootScope.apiUrl + url + "limit=1000").then(function (response) {
                $scope.students = response.data;
                if (value === 'all') {
                    $scope.students = response.data.results;
                }
                for (var i = 0; i < $scope.students.length; i++){
                    $scope.students[i].year = Math.floor(2018 - $scope.students[i].username/10000);
                    $scope.students[i].ids =  $scope.students[i].id;
                }
                $scope.students.sort(function(a, b){
                    if (a.id < b.id) //sort string ascending
                        return -1 ;
                    if (a.id > b.id)
                        return 1;
                    return 0; //default return value (no sorting)
                });
                simpleList = $scope.students;
                $rootScope.filtedStudents = simpleList;
                self.tableParams.settings({
                    dataset: angular.copy(simpleList)
                });
                $scope.filtedStudentsss = $rootScope.filtedStudents;
                $scope.loading = false;
            });
        }
        else{
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }
    };
    function add() {
        self.isEditing = true;
        self.isAdding = true;
        self.tableParams.settings().dataset.unshift({
            name: "",
            age: null,
            money: null
        });
        self.tableParams.sorting({});
        self.tableParams.page(1);
        self.tableParams.reload();
    }
    function saveScore() {
        if (auth.isAuthed()){
            originalData = angular.copy(self.tableParams.settings().dataset);
            var data = [];
            var legit = 0;
            $scope.loading = true;
            console.log($rootScope.profile);
            console.log($scope.selected_session);
            for (var j = 0; j < $rootScope.profile.sessions.length; j ++){
                if ($scope.selected_session === $rootScope.profile.sessions[j].id){
                    legit = 1;
                    break;
                }
            };
            if (legit === 1) {
                for (var i = 0; i < originalData.length; i++) {
                    var temp = {
                        'score': originalData[i].score,
                        'session_id': originalData[i].session_id,
                        'student_id': originalData[i].student_id
                    };
                    data.push(temp);
                }
                console.log(data);
                $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + '/scores/edit_many/',
                    data: data
                }).success(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .content("Updated " + originalData[0].name + "'s Score Successfully!")
                            .hideDelay(2000)
                            .position('right bottom')
                    );
                    $scope.loading = false;
                }).error(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .content("Updated " + originalData[0].name + "'s Score Unsuccessfully!")
                            .hideDelay(2000)
                            .position('right bottom')
                    );
                    $scope.loading = false;
                })
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                        .content("You don't have permission to change " + originalData[0].name + "'s Score!")
                        .hideDelay(2000)
                        .position('right bottom')
                );
            }
        }
        else{
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
            auth.logout();
        }
    };
    function cancelChanges() {
        resetTableStatus();
        var currentPage = self.tableParams.page();
        self.tableParams.settings({
            dataset: angular.copy(simpleList)
        });
        if (!self.isAdding) {
            self.tableParams.page(currentPage);
        }
    }

    function del(row) {
        _.remove(self.tableParams.settings().dataset, function(item) {
            return row === item;
        });
        self.deleteCount++;
        self.tableTracker.untrack(row);
        self.tableParams.reload().then(function(data) {
            if (data.length === 0 && self.tableParams.total() > 0) {
                self.tableParams.page(self.tableParams.page() - 1);
                self.tableParams.reload();
            }
        });
    }

    function hasChanges() {
        return self.tableForm.$dirty || self.deleteCount > 0
    }

    function resetTableStatus() {
        self.isEditing = false;
        self.isAdding = false;
        self.deleteCount = 0;
        // self.tableTracker.reset();
        self.tableForm.$setPristine();
    }

    function saveChanges() {
        resetTableStatus();
        var currentPage = self.tableParams.page();
        originalData = angular.copy(self.tableParams.settings().dataset);
    }
}
