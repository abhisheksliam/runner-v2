'use strict';

angular.module('automationApp.scriptor')
	.controller('NewScriptController', ['$rootScope', '$scope', 'pluginsService', 'applicationService', '$location', '$state', 'scriptorService',
		function($rootScope, $scope, pluginsService, applicationService, $location, $state, scriptorService) {

            $rootScope.runnerIcon = false;
            $scope.taskId = "";
            $scope.copy_task_id = "";
            scriptorService.taskContent = {};
            $scope.iCheckOptions = {
                radioClass: 'iradio_flat-blue'
            };

			/* Template Code to be kept in first route to be loaded */
			$scope.$on('$viewContentLoaded', function () {
				pluginsService.init();
                applicationService.createSideScroll();
				applicationService.customScroll();
				applicationService.handlePanelAction();
				$('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
				$('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');

				if($location.$$path == '/'){
					$('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
					$('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
					if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
					if ($('body').hasClass('submenu-hover')) return;
					$('.nav.nav-sidebar .nav-parent .children').slideUp(200);
					$('.nav-sidebar .arrow').removeClass('active');
					$('body').addClass('dashboard');
				} else {
					$('body').removeClass('dashboard');
				}
			});

                scriptorService.getGlobalContext().then(function (res) {
                    $rootScope.globalConstants = res.data;

                    $scope.templateOptions = $rootScope.globalConstants.templateOptions;
                    $scope.template = $scope.templateOptions[0].key;
                });

			$scope.displayScript = function(){

                if ($scope.taskId == undefined || $scope.taskId.length === 0) {
					$scope.showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + 'Task Id cannot be blank !' + '</p></div>');

                }
                else if ($scope.validateTaskId($scope.taskId)){

                    $scope.taskId = $scope.taskId.toUpperCase().replace(/\s+/g,'');

                    var taskMetadata = scriptorService.getApplicationFromScenarioId($scope.taskId, $rootScope.globalConstants);

                    if(taskMetadata.application === undefined || taskMetadata.scenario === undefined) {
                        $scope.showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + 'Application or Scenario Type not present in SLE ID !' + '</p></div>');
                    } else {

                        $scope.applicationName = taskMetadata.application.label;
                        $scope.scenarioType = taskMetadata.scenario;
                        $scope.sleId = taskMetadata.sleId;

                        if (($scope.taskId === $scope.copy_task_id) && $scope.template === 'task'){
                            $scope.showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + 'Same task cannot be duplicated !!' + '</p></div>');
                        } else {
                            scriptorService.saveTaskScript($scope.applicationName, $scope.scenarioType, $scope.taskId, $scope.sleId, $scope.copy_task_id.toUpperCase().replace(/\s+/g,''), $scope.template, '', $rootScope.authentication.user.username).then(function(res) {

                                if(res.data.errors) {
                                    if(res.data.errors.errorCode === 'EXISTS_IN_DB'){
                                        bootbox.confirm({
                                            title: 'Task already exists',
                                            message: 'Do you want to override task with new selections ?',
                                            className: 'error-modal',
                                            callback: function(result) {
                                                if(result) {
                                                    scriptorService.updateTaskScript($scope.applicationName, $scope.scenarioType, $scope.taskId, $scope.sleId, $scope.copy_task_id.toUpperCase().replace(/\s+/g,''), $scope.template, '', $rootScope.authentication.user.username).then(function(res) {
                                                        if(res.data.errors){
                                                            $scope.showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + res.data.errors.errorMessage + '</p></div>');
                                                        }
                                                        else {
                                                            scriptorService.taskContent = res.data.task_json;
                                                            $state.go('app.script-editor',  {id: res.data.task_id});
                                                            $scope.showNotify('<div class="alert alert-success m-r-30"><p><strong>' + 'Task updated successfully !' + '</p></div>');
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        $scope.showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + res.data.errors.errorMessage + '</p></div>');
                                    }
                                } else{
                                    scriptorService.taskContent = res.data.task_json;
                                    $state.go('app.script-editor',  {id: res.data.task_id});
                                    $scope.showNotify('<div class="alert alert-success m-r-30"><p><strong>' + 'Task Created successfully !' + '</p></div>');
                                }
                            });
                        }
                    }
                } else{
					$scope.showNotify('<div class="alert alert-danger m-r-30"><p><strong>' + 'Invalid Task Id !' + '</p></div>');
                }

			};

		}]);
