"use strict";

angular.module('automationApp.sidebar')
    .directive('previewModal', ['scriptorService','$location','$rootScope', '$window',function(scriptorService, $location,$rootScope, $window  ) {
        return {
            restrict: 'E',
            replace: true,
            scope:{},
            templateUrl: 'modules/sidebar/views/previewModal.tpl.html',
            link: function (scope, element, attributes) {

                scope.previewXML = function(){
                    if (scope.previewSleId == undefined || scope.previewSleId.length === 0) {
                        $rootScope.showNotify('<div class="alert alert-danger"><p><strong>' + 'SLE Id cannot be blank !' + '</p></div>','.modal-body');
                    }
                    else if ($rootScope.validateTaskId(scope.previewSleId)){	// client side validation
                        // api call
                        scriptorService.getTaskJson(scope.previewSleId).then(function(res) {
                            if(res.data.errors) {
                                $rootScope.showNotify('<div class="alert alert-danger"><p><strong>' + res.data.errors.errorMessage + '</p></div>','.modal-body');
                            } else{
                                $('#modal-previewModal').modal('hide');

                                var queryParam = '?format=xml';
                                $window.open($location.protocol() + "://" + $location.host() + ':' + $location.port() + '/api/tasks/' + res.data.sle_id + queryParam);
                            }
                        });
                    } else{
                        $rootScope.showNotify('<div class="alert alert-danger"><p><strong>' + 'Invalid Task Id !' + '</p></div>','.modal-body');
                    }
                };
            }
        }
    }]);
