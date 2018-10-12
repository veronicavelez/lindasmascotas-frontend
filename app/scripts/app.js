'use strict';

/**
 * @ngdoc overview
 * @name lindasmascotasApp
 * @description
 * # lindasmascotasApp
 *
 * Main module of the application.
 */


var lindasmascotas = angular.module('lindasmascotasApp', [
  //Directivas
  'ngAnimate'                    , 'ngCookies'                , 'ngResource'            ,
  'ngRoute'                      , 'ngSanitize'               , 'ngTouch'               ,
  'ui.router'                    , 'ui.bootstrap'             , 'ui.codemirror'         ,
  'angular-flot'                 , 'colorpicker.module'       , 'ngDropzone'            ,
  'ngMorrisChart'                , 'ngSparkline'              , 'ui.select2'            ,
  'chainDirectives'              , 'inputMayus'               , 'inputOnlyNumbers'      ,

  //Controladores
  'ConfigCountries'            , 'ConfigDepartments'      , 'ConfigCities'        ,
  'ConfigDocumentTypes'        , 'ConfigRazas'          , 'ConfigEspecies'    ,
  'ConfigOccupations'          , 'ConfigBarrios' , 'ConfigGeneros'   ,
  'ConfigPerfiles'    , 'ConfigProductos'  , 'ConfigServicios' ,
  'ConfigSexos'            , 'ConfigTipoContratos'       , 'ConfigTipoSangre'         ,
  'ConfigVacunas'               , 'ConfigEmpleados'           , 'ConfigMascotas'  ,
  'ConfigPropietarios'             , 'ConfigCitas' ,
  
  
  'chainDashboard'      , 'chainMessages'       , 'chainElemAlerts'  ,
  'chainElemButtons'    , 'chainElemExtras'     , 'chainElemGraphs'  ,
  'chainElemIcons'      , 'chainElemModals'     , 'chainElemWidgets' ,
  'chainElemSliders'    , 'chainElemTabs'       , 'chainElemTypo'    ,
  'chainFormEditor'     , 'chainFormForms'      , 'chainFormLayouts' ,
  'chainFormTextEditor' , 'chainFormValidation' , 'chainFormWizards' ,
  'chainTablesBasic'    , 'chainTablesData'     , 'chainMaps'        ,
  'chainPageBlank'      ,

  //Servicios
  'ConfigCountriesSvc'         , 'ConfigDepartmentsSvc'   , 'ConfigCitiesSvc'      ,
  'DocumentTypesSvc'           , 'RazasSvc'             , 'EspeciesSvc'        ,
  'OccupationsSvc'             , 'BarriosSvc'    , 'GenerosSvc'       ,
  'PerfilesSvc'       , 'ProductosSvc'     , 'ServiciosSvc'     ,
  'SexosSvc'         , 'TipoContratosSvc'    , 'TipoSangreSvc'       ,
  'VacunasSvc'            , 'EmpleadosSvc'        , 'MascotasSvc',
  'PropietariosSvc' , 'CitasSvc'
]);

lindasmascotas.controller('MainCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

  $scope.$state = $state;

  // get leftmenus
  $http.get('data/menus.json').then(function(data) {
    $scope.leftmenus = data.data;
  });

  // get notification
  // $http.get('data/notification.json').then(function(data) {
  //   $scope.notification = data;
  //   $scope.notiCount = data.length;
  // });

  // get new messages
  // $http.get('data/messages.json').then(function(data) {
  //   $scope.messages = data;
  // });

  // show page
  $scope.showPage = function(sref) {
    $state.go(sref);
    hideAllSubMenu();
  };

  // set hover class to left menu
  $scope.setHover = function(set, $event) {
    var elem = angular.element($event.currentTarget);
    if(set) {
      elem.addClass('nav-hover');
    } else {
      elem.removeClass('nav-hover');
    }
  };

  // show submenu when clicking parent menu
  $scope.showSubMenu = function($event) {

    var parent = angular.element($event.currentTarget).parent();
    var children = parent.find('.children');

    if (children.is(':visible')) {
      children.slideUp();
    } else {
      hideAllSubMenu();
      children.slideDown();
      parent.addClass('parent-focus');
    }
  };

  function hideAllSubMenu() {
    angular.element('.leftpanel .nav .children').each(function() {
      var t = angular.element(this);
      t.slideUp(function(){
        t.closest('li').removeClass('parent-focus');
      });
    });
  };

  // collapse/expand left menu
  $scope.menuCollapse = function() {
    if (!angular.element('body').hasClass('hidden-left')) {
      if (angular.element('.headerwrapper').hasClass('collapsed')) {
        angular.element('.headerwrapper, .mainwrapper').removeClass('collapsed');
      } else {
        angular.element('.headerwrapper, .mainwrapper').addClass('collapsed');
        angular.element('.children').hide(); // hide sub-menu if leave open
      }
    } else {
      if (!angular.element('body').hasClass('show-left')) {
        angular.element('body').addClass('show-left');
      } else {
        angular.element('body').removeClass('show-left');
      }
    }
  };

  angular.element(window).resize(function(){
    hideMenu();
  });

  hideMenu(); // for loading/refreshing the page
   function hideMenu() {
      
      if(angular.element('.header-right').css('position') == 'relative') {
        angular.element('body').addClass('hidden-left');
        angular.element('.headerwrapper, .mainwrapper').removeClass('collapsed');
      } else {
        angular.element('body').removeClass('hidden-left');
      }
      
      // Seach form move to left
      if (angular.element(window).width() <= 360) {
         if (angular.element('.leftpanel .form-search').length == 0) {
          angular.element('.form-search').insertAfter($('.profile-left'));
         }
      } else {
         if (angular.element('.header-right .form-search').length == 0) {
          angular.element('.form-search').insertBefore(angular.element('.btn-group-notification'));
         }
      }
   }

}]);

lindasmascotas.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise('/dashboard');

  // You can change state to each page by going to each controllers
  $stateProvider
  .state('MainCtrl', {
    abstract: true,
    template: '<ui-view/>'
  });

}]);
