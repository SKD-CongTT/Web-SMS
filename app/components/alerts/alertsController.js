/**
 * Created by sonsi_000 on 6/27/2016.
 */

angular.module('webix')

    .controller('alertsController',function ($scope,$rootScope,$http,auth,$interval,$timeout,$state,webNotification,searchQueryAlert,$mdToast,$mdDialog) {
        if(auth.isAuthed()){
            console.log(1);
            /*Get Alerts*/
           //  $scope.alerts =[];
           //  $scope.wrong_alerts =[];
           //  $scope.selectedAlert = {};
           //  $scope.alertModal = {};
           //  $scope.loadingTable = true;
           //  $scope.loading = true;
           //  $scope.loadingTableIp = true;
           //  $scope.ips =[];
           //  $scope.trusted_ip = {};
           //  $scope.totalAlerts = 0 ;
           //  $scope.totalItems = 0;
           //
           //  webNotification.allowRequest = true;
           //  $scope.queryAlert = {data:""}
           //  $scope.queryAlert.data = searchQueryAlert.getSearchQueryAlert();
           //  $scope.$watch("queryAlert.data", function (newValue, oldValue) {
           //      if (newValue !== oldValue) searchQueryAlert.setQueryAlert(newValue);
           //  },true);
           //
           //  $scope.refresh_alert = refresh_alert;
           //  var getClass = function () {
           //      if (auth.isAuthed()){
           //          $http.get($rootScope.apiUrl + "/classes/").then(function (response) {
           //             console.log(response);
           //          });
           //      }
           //      else{
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //  getClass();
           //  function refresh_alert(page, pageSize) {
           //      if (auth.isAuthed()) {
           //          $scope.page = page;
           //          $scope.pageSize = pageSize;
           //
           //          page =(page-1)*pageSize;
           //          if ($scope.queryAlert.data !== "") {
           //              return $http({
           //                  method: 'POST',
           //                  url: $rootScope.apiUrl + '/get_alerts/from/' + page + '/size/' + pageSize,
           //                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //                  transformRequest: function (obj) {
           //                      var str = [];
           //                      for (var p in obj)
           //                          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                      return str.join("&");
           //                  },
           //                  data: {
           //                      userQuery: $scope.queryAlert.data
           //                  }
           //              }).then(function(response){
           //                  return {
           //                      results: response.data.result,
           //                      totalResultCount: response.data.count
           //                  }
           //              })
           //          } else {
           //              return $http.get($rootScope.apiUrl + '/get_alerts/from/' + page + '/size/' + pageSize)
           //                  .then(function (response) {
           //                      return {
           //                          results: response.data.result,
           //                          totalResultCount: response.data.count
           //                      }
           //                  });
           //          }
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  }
           //
           //  var stopRefreshAlert = $interval(function () {
           //      refresh_alert($scope.page, $scope.pageSize);
           //  },1000*60);
           //
           //  $scope.searchAlert = function() {
           //      refresh_alert(1,5);
           //      console.log($scope.queryAlert);
           //  };
           //
           //  var changeRoute = $rootScope.$on('$locationChangeSuccess', function() {
           //      $interval.cancel(stopRefreshAlert);
           //      $state.reload();
           //      changeRoute();
           //  });
           //
           //  /*Get wrong alert*/
           //  var refresh_wrong_alert = function () {
           //      $http.get($rootScope.apiUrl + '/get_wrong_alerts').success(function (response) {
           //          $scope.wrong_alerts = response;
           //          $scope.loadingWrongTable = false;
           //      });
           //  };
           //  refresh_wrong_alert();
           //
           //
           //  $scope.pageChanged = function(newPage){
           //      if (auth.isAuthed()){
           //          getDetailInfo(newPage);
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //
           //  };
           //
           //  $scope.pagination = {
           //      current: 1
           //  };
           //  $scope.totalRecord = 0 ;
           //
           //  $scope.showDetail = function (value) {
           //      if(auth.isAuthed()) {
           //          $mdDialog.show({
           //              controller: DialogDetailController,
           //              locals: {value: value},
           //              templateUrl: 'components/alerts/detailAlertTemplate.html',
           //              parent: angular.element(document.body),
           //              clickOutsideToClose:true
           //          });
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  function DialogDetailController($scope, $mdDialog, value) {
           //
           //      $scope.hide = function() {
           //          $mdDialog.hide();
           //      };
           //
           //      $scope.cancel = function() {
           //          $mdDialog.cancel();
           //      };
           //
           //      $scope.onRequest = true;
           //
           //      var getDetailInfo = function (page, size) {
           //          page =(page-1)*10;
           //          $scope.selectedAlert = {
           //              info : []
           //          };
           //
           //          $scope.totalRecord = 0 ;
           //          $http({
           //              method: 'POST',
           //              url: $rootScope.apiUrl + '/get_detail_alert/from/' + page + '/size/' + size,
           //              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //              transformRequest: function (obj) {
           //                  var str = [];
           //                  for (var p in obj)
           //                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                  return str.join("&");
           //              },
           //              data: {
           //                  _id: value
           //              }
           //          }).success(function (response) {
           //              $scope.totalRecord = response.count;
           //              $scope.selectedAlert = response.result;
           //              $scope.selectedAlert.info = response.detail;
           //          });
           //      };
           //
           //      $scope.pageChanged = function(newPage){
           //          if (auth.isAuthed()){
           //              getDetailInfo(newPage);
           //          } else {
           //              alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //              auth.logout();
           //          }
           //
           //      };
           //
           //      $scope.pagination = {
           //          current: 1
           //      };
           //      getDetailInfo(1,10);
           //  }
           //
           //  /*report wrong alert function*/
           //  $scope.alertList = {
           //      id: []
           //  };
           //
           //  $scope.selectedRowCallback = function(rows){
           //      $scope.alertList.id = rows;
           //  };
           //
           //  var toastSuccess = $mdToast.simple()
           //      .textContent('Báo cáo Cảnh báo Sai thành công')
           //      .position('right bottom');
           //
           //  var toastFail = $mdToast.simple()
           //      .textContent('Báo cáo Cảnh báo Sai thất bại')
           //      .position('right bottom');
           //
           //  $scope.openReportModal = function () {
           //      if(auth.isAuthed()) {
           //          var confirm = $mdDialog.confirm()
           //              .title('BÁO CÁO CẢNH BÁO SAI')
           //              .textContent('Bạn có chắc chắn muốn báo cáo cảnh báo đã chọn ?')
           //              .ariaLabel('Báo cáo Cảnh báo sai')
           //              .ok('Xác nhận')
           //              .cancel('Hủy bỏ');
           //
           //          $mdDialog.show(confirm).then(function() {
           //              $http({
           //                  method: 'POST',
           //                  url: $rootScope.apiUrl + '/update_alerts',
           //                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //                  transformRequest: function (obj) {
           //                      var str = [];
           //                      for (var p in obj)
           //                          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                      return str.join("&");
           //                  },
           //                  data: {
           //                      _id:$scope.alertList.id
           //                  }
           //              }).success(function(response){
           //                      if (response['result']) {
           //                          $mdToast.show(toastSuccess);
           //                          $state.reload();
           //                      } else {
           //                          $mdToast.show(toastFail);
           //                      }
           //                  }).error(function () {
           //                  $mdToast.show(toastFail);
           //              })
           //          }, function() {
           //          });
           //
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  $scope.report = function () {
           //      if(auth.isAuthed()) {
           //          $http({
           //              method: 'POST',
           //              url: $rootScope.apiUrl + '/update_alerts',
           //              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //              transformRequest: function (obj) {
           //                  var str = [];
           //                  for (var p in obj)
           //                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                  return str.join("&");
           //              },
           //              data: {
           //                  _id:$scope.alertList.id
           //              }
           //          }).success(function (response) {
           //              if (response['result']) {
           //                  console.log('bao sai thanh cong');
           //              } else {
           //                  console.log('bao sai that bai');
           //              }
           //              refresh_alert($scope.paginationAlert.current);
           //              refresh_wrong_alert();
           //          }).error(function () {
           //              console.log('bao sai thanh cong');
           //          })
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  $scope.openRestoreModal = function () {
           //      if(auth.isAuthed()) {
           //          $scope.selectedAlert = {};
           //          $scope.selectedAlert = angular.copy(this.wa);
           //          $('#restoreModal').modal('show');
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  $scope.restore = function () {
           //      if(auth.isAuthed()) {
           //          $http({
           //              method: 'POST',
           //              url: $rootScope.apiUrl + '/update_alerts',
           //              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //              transformRequest: function (obj) {
           //                  var str = [];
           //                  for (var p in obj)
           //                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                  return str.join("&");
           //              },
           //              data: {
           //                  _id:$scope.selectedAlert._id.$id,
           //              }
           //          }).success(function (response) {
           //              if (response['result']) {
           //                  Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Khôi phục cảnh báo sai thành công', positionX: 'center', delay: 3000});
           //              } else {
           //                  Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Khôi phục cảnh báo sai thất bại', positionX: 'center', delay: 3000});
           //              }
           //              refresh_alert($scope.paginationAlert.current);
           //              refresh_wrong_alert();
           //          }).error(function () {
           //              Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Khôi phục cảnh báo sai thất bại', positionX: 'center', delay: 3000});
           //          })
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //  $scope.deleteAlertModal = function () {
           //      if(auth.isAuthed()) {
           //          $scope.selectedAlert = angular.copy(this.wa);
           //          $('#deleteModalAlert').modal('show');
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //  $scope.deleteAlert = function () {
           //      $http({
           //          method: 'POST',
           //          url: $rootScope.apiUrl + '/delete_alert',
           //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //          transformRequest: function (obj) {
           //              var str = [];
           //              for (var p in obj)
           //                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //              return str.join("&");
           //          },
           //          data: {
           //              _id:$scope.selectedAlert._id.$id
           //          }
           //      })
           //          .success(function (response) {
           //              if (response['result']) {
           //                  Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Xóa cảnh báo thành công', positionX: 'center', delay: 3000});
           //              } else {
           //                  Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa cảnh báo thất bại', positionX: 'center', delay: 3000});
           //              }
           //              refresh_alert($scope.paginationAlert.current);
           //              refresh_wrong_alert();
           //          }).error(function () {
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa cảnh báo thất bại', positionX: 'center', delay: 3000});
           //      })
           //  };
           //
           //
           //  /*Get Rules*/
           //
           //  $scope.currentPageRule = 1;
           //  var refresh = function () {
           //      $http.get($rootScope.apiUrl + '/get_all_rules').success(function (response) {
           //          $scope.ruleLists = response;
           //          $scope.loading = false;
           //      });
           //  };
           // refresh();
           //
           //  /*Create Rule function*/
           //  $scope.createRuleModal = function () {
           //      if(auth.isAuthed()) {
           //          $('#createModal').modal('show');
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  $scope.createAlert = function () {
           //      if(auth.isAuthed()) {
           //          $http({
           //              method: 'POST',
           //              url: $rootScope.apiUrl+"/create_alert",
           //              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //              transformRequest: function (obj) {
           //                  var str = [];
           //                  for (var p in obj)
           //                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                  return str.join("&");
           //              },
           //              data: {
           //                  name: $scope.alertModal.name,
           //                  severity: $scope.alertModal.severity,
           //                  rule_raw: $scope.alertModal.rule_raw,
           //                  tag_description: $scope.alertModal.tag_description
           //              }
           //          }).success(function (response) {
           //              $('#createModal').modal('hide');
           //              if (response['result']) {
           //                  Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Tạo bộ nhận dạng thành công', positionX: 'center', delay: 3000});
           //              } else {
           //                  Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Tạo bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //              }
           //              refresh();
           //          }).error(function () {
           //              $('#createModal').modal('hide');
           //              Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Tạo bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //          })
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  /*Edit Rule function*/
           //  $scope.editRuleModal = function () {
           //      $scope.selectedRule = angular.copy(this.r);
           //      $('#editModal').modal('show');
           //  };
           //
           //  $scope.editRule = function () {
           //      $http({
           //          method: 'POST',
           //          url: $rootScope.apiUrl + '/update_rule',
           //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //          transformRequest: function (obj) {
           //              var str = [];
           //              for (var p in obj)
           //                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //              return str.join("&");
           //          },
           //          data: {
           //              _id:$scope.selectedRule._id.$id,
           //              name: $scope.selectedRule.name,
           //              severity: $scope.selectedRule.severity,
           //              rule_raw: $scope.selectedRule.rule_raw,
           //              tag_description: $scope.selectedRule.tag_description
           //          }
           //      }).success(function (response) {
           //          if (response['result']) {
           //              $('#editModal').modal('hide');
           //              Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Thay đổi thông tin bộ nhận dạng thành công', positionX: 'center', delay: 3000});
           //          } else {
           //              $('#editModal').modal('hide');
           //              Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi thông tin bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //          }
           //          refresh();
           //      }).error(function () {
           //          $('#editModal').modal('hide');
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi thông tin bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //      })
           //  };
           //
           //  $scope.updateStatusRule = function () {
           //      $scope.selectedRule = angular.copy(this.r);
           //      $http({
           //          method: 'POST',
           //          url: $rootScope.apiUrl + '/update_status_rule',
           //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //          transformRequest: function (obj) {
           //              var str = [];
           //              for (var p in obj)
           //                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //              return str.join("&");
           //          },
           //          data: {
           //              _id:$scope.selectedRule._id.$id
           //          }
           //      }).success(function (response) {
           //          if (response['result']) {
           //              $('#editModal').modal('hide');
           //              Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Thay đổi trạng thái bộ nhận dạng thành công', positionX: 'center', delay: 3000});
           //          } else {
           //              $('#editModal').modal('hide');
           //              Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi trạng thái bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //          }
           //          refresh();
           //      }).error(function () {
           //          $('#editModal').modal('hide');
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi trạng thái bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //      })
           //  };
           //
           //
           //  $scope.deleteRuleModal = function () {
           //      $scope.selectedRule = angular.copy(this.r);
           //      $('#deleteModal').modal('show');
           //  };
           //
           //  $scope.deleteRule = function () {
           //      $http({
           //          method: 'POST',
           //          url: $rootScope.apiUrl + '/delete_rule',
           //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //          transformRequest: function (obj) {
           //              var str = [];
           //              for (var p in obj)
           //                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //              return str.join("&");
           //          },
           //          data: {
           //              _id:$scope.selectedRule._id.$id
           //          }
           //      })
           //          .success(function (response) {
           //              if (response['result']) {
           //                  Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Xóa bộ nhận dạng thành công', positionX: 'center', delay: 3000});
           //              } else {
           //                  Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //              }
           //              refresh();
           //          }).error(function () {
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa bộ nhận dạng thất bại', positionX: 'center', delay: 3000});
           //      })
           //  };
           //
           //
           //  /*Ip table*/
           //
           //
           //  var refresh1 = function () {
           //      $http.get($rootScope.apiUrl + '/get_trusted_ip')
           //          .success(function (response) {
           //              if(response['result']) {
           //                  $scope.ips = response['trusted_ip'];
           //                  $scope.loadingTableIp = false;
           //              } else {
           //                  $scope.loadingTableIp = false;
           //                  $scope.ips =[];
           //              }
           //          });
           //      };
           //
           //  refresh1();
           //
           //  $scope.editIpModal = function () {
           //      $scope.ipModal = angular.copy(this.i);
           //      $('#editModalIp').modal('show');
           //  };
           //
           //  $scope.editIp = function () {
           //      $http({
           //          method: 'POST',
           //          url: $rootScope.apiUrl + '/update_trusted_ip/' + $scope.ipModal.id,
           //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //          transformRequest: function (obj) {
           //              var str = [];
           //              for (var p in obj)
           //                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //              return str.join("&");
           //          },
           //          data: {
           //              trusted_ip:$scope.ipModal.trusted_ip
           //          }
           //      }).success(function (response) {
           //          if (response['result']) {
           //              $('#editModalIp').modal('hide');
           //              Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Thay đổi địa chỉ IP thành công', positionX: 'center', delay: 3000});
           //          } else {
           //              $('#editModalIp').modal('hide');
           //              Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Địa chỉ IP đã tồn tại', positionX: 'center', delay: 3000});
           //          }
           //          refresh1();
           //      }).error(function () {
           //          $('#editModalIp').modal('hide');
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thay đổi địa chỉ IP thất bại', positionX: 'center', delay: 3000});
           //      })
           //  };
           //
           //  $scope.deleteIpModal = function () {
           //      $scope.ipModal = angular.copy(this.i);
           //      $('#deleteModalIp').modal('show');
           //  };
           //  $scope.deleteIp = function () {
           //      $http.get($rootScope.apiUrl + '/remove_trusted_ip/'+ $scope.ipModal.id)
           //          .success(function (response) {
           //              if (response['result']) {
           //                  Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Xóa địa chỉ IP thành công', positionX: 'center', delay: 3000});
           //              } else {
           //                  Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa địa chỉ IP thất bại', positionX: 'center', delay: 3000});
           //              }
           //              refresh1();
           //          }).error(function () {
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Xóa địa chỉ IP thất bại', positionX: 'center', delay: 3000});
           //      })
           //
           //  }
           //
           //  $scope.addIpModal = function () {
           //      $scope.trusted_ip = {};
           //      $('#addModal').modal('show');
           //  };
           //
           //  $scope.addIp = function () {
           //      $http({
           //          method: 'POST',
           //          url: $rootScope.apiUrl + '/create_trusted_ip' ,
           //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //          transformRequest: function (obj) {
           //              var str = [];
           //              for (var p in obj)
           //                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //              return str.join("&");
           //          },
           //          data: {
           //              trusted_ip: $scope.trusted_ip.address
           //          }
           //      }).success(function (response) {
           //          if (response['result']) {
           //              $('#addModal').modal('hide');
           //              Notification.success({message: '<i class=\"fa fa-check-circle\"></i> Thêm địa chỉ IP thành công', positionX: 'center', delay: 3000});
           //          } else {
           //              $('#addModal').modal('hide');
           //              Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Địa chỉ IP đã tồn tại', positionX: 'center', delay: 3000});
           //          }
           //          refresh1();
           //      }).error(function () {
           //          $('#addModal').modal('hide');
           //          Notification.error({message: '<i class=\"fa fa-exclamation-circle\"></i> Thêm địa chỉ IP thất bại', positionX: 'center', delay: 3000});
           //      })
           //  };
           //
           //  /*Report*/
           //  $scope.datePickerUI = {
           //      startDate: moment().subtract(30, "days"),
           //      endDate: moment()
           //  };
           //
           //  $scope.datePicker = {
           //      startDate: moment().subtract(30, "days"),
           //      endDate: moment()
           //  };
           //
           //  $scope.currentDay = moment();
           //
           //  $scope.opts = {
           //      locale: {format: 'DD/MM/YYYY'},
           //      ranges: {
           //          '1 tháng trước': [moment().subtract(30, 'days'), moment()],
           //          '2 tháng trước': [moment().subtract(60, 'days'), moment()],
           //          '3 tháng trước': [moment().subtract(90, 'days'), moment()]
           //      },
           //      eventHandlers : {
           //          'hide.daterangepicker' : function(ev) {
           //              $scope.datePicker= ev.model;
           //          }
           //      }
           //  };
           //
           //  $scope.reportTypeLists = [
           //                              {id:1, name: 'Tổng hợp'},
           //                              {id:2, name: 'Tình trạng các cuộc tấn công mạng theo thời gian'},
           //                              {id:3, name: 'Danh sách (TOP 100) địa chỉ IP tấn công nhiều nhất vào hệ thống'}
           //                          ];
           //
           //  $scope.isGeneral = false;
           //  $scope.isAttackActivities = false;
           //  $scope.isAttackedIp = false;
           //
           //  $scope.setData = function (data) {
           //
           //      if (data.id == 1) {
           //          $scope.isGeneral = data.selected;
           //      }
           //
           //      if (data.id == 2) {
           //          $scope.isAttackActivities = data.selected;
           //      }
           //
           //      if (data.id == 3) {
           //          $scope.isAttackedIp = data.selected;
           //      }
           //  };
           //
           //  $scope.downloadReport = function() {
           //      $scope.dateFrom = "";
           //      $scope.dateTo = "";
           //      var dayStartDate =  $scope.datePicker.startDate._d.getDate();
           //      var monthStartDate = $scope.datePicker.startDate._d.getMonth()+1;
           //      var yearStartDate = $scope.datePicker.startDate._d.getFullYear();
           //      var dayEndDate =  $scope.datePicker.endDate._d.getDate();
           //      var monthEndDate = $scope.datePicker.endDate._d.getMonth()+1;
           //      var yearEndDate = $scope.datePicker.endDate._d.getFullYear();
           //      $scope.dateFrom = $scope.dateFrom.concat(dayStartDate,'/',monthStartDate,'/',yearStartDate);
           //      $scope.dateTo = $scope.dateTo.concat(dayEndDate,'/',monthEndDate,'/',yearEndDate);
           //      if(auth.isAuthed()) {
           //          $http({
           //              method: 'POST',
           //              url: $rootScope.apiUrl + '/export',
           //              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
           //              transformRequest: function (obj) {
           //                  var str = [];
           //                  for (var p in obj)
           //                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           //                  return str.join("&");
           //              },
           //              data: {
           //                  from: $scope.dateFrom,
           //                  to: $scope.dateTo,
           //                  isGeneral: $scope.isGeneral,
           //                  isAttackActivities: $scope.isAttackActivities,
           //                  isAttackedIp: $scope.isAttackedIp
           //              },
           //              responseType : 'arraybuffer'
           //          }).success(function(data) {
           //              // TODO when WS success
           //              var file = new Blob([ data ], {
           //                  type : 'application/pdf'
           //              });
           //              saveAs(file, '[WebInspector]Bao-cao-tong-hop.pdf')
           //
           //          }).error(function(data, status, headers, config) {
           //              //TODO when WS error
           //          });
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };
           //
           //  $scope.downloadQuickReport = function(type) {
           //      if(auth.isAuthed()) {
           //          $http({
           //              url : $rootScope.apiUrl + '/'+ type,
           //              method : 'GET',
           //              // params : {},
           //              // headers : {
           //              //     'Content-type' : 'application/pdf',
           //              // },
           //              responseType : 'arraybuffer'
           //          }).success(function(data) {
           //              if(data['result'] != false) {
           //                  // TODO when WS success
           //                  var file = new Blob([ data ], {
           //                      type : 'application/pdf'
           //                  });
           //
           //                  var name ="";
           //
           //                  if (type == 'daily_export') {
           //                      name = "[WebInspector]Bao-cao-nhanh-trong-ngay";
           //                  }
           //
           //                  if (type == 'weekly_export') {
           //                      name = "[WebInspector]Bao-cao-nhanh-trong-tuan";
           //                  }
           //
           //                  if (type == 'monthly_export') {
           //                      name = "[WebInspector]Bao-cao-nhanh-trong-thang";
           //                  }
           //
           //                  //trick to download store a file having its URL
           //                  // var fileURL = URL.createObjectURL(file);
           //                  // var a         = document.createElement('a');
           //                  // a.href        = fileURL;
           //                  // a.target      = '_blank';
           //                  // a.download    = 'yourfilename.pdf';
           //                  // document.body.appendChild(a);
           //                  // a.click();
           //                  saveAs(file, name + '.pdf');
           //              }
           //          }).error(function(data, status, headers, config) {
           //              //TODO when WS error
           //          });
           //      } else {
           //          alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại.');
           //          auth.logout();
           //      }
           //  };


        } else {
            alert ('Phiên làm việc của bạn đã hết ! Xin mời đăng nhập lại');
            auth.logout();
        }
    });
