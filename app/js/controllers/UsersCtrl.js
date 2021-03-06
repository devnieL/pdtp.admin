'use strict';

/**
* UsersCtrl
* @namespace pdtp.admin.controllers
*/

angular
.module('pdtp.admin.controllers')
.controller('UsersCtrl', function ($scope, UsersService, $state, $stateParams){

  $scope.users = [];
  $scope.quantity = 50;
  $scope.page = parseInt($stateParams.page, 10) || 1;
  $scope.total = 0;
  $scope.totalPages = 0;
  $scope.query = null || $stateParams.search;
  $scope.noResults = null;
  $scope.loading = null;

  /**
   * Listar todos los usuarios con una
   * paginación determinada.
   * 
   * @param  {Number} page
   * @param  {Number} quantity
   */
  $scope.list = function(page, quantity){
    $scope.loading = UsersService
    .list(page, quantity)
    .success(function(response){
      
      $scope.users = response.data;
      for(var i in $scope.users)
        $scope.users[i].fecha_creacion = new Date($scope.users[i].fecha_creacion);

      $scope.cachePage = page;
      $scope.cacheUsers = $scope.users;

    })
    .error(function(err){
      console.error(err);
    });
  };

  /**
   * Buscar a un usuario por nombre o
   * correo.
   * 
   * @param  {String} query
   */
  $scope.search = function(query){
    if(query != null && query != undefined && query.length > 0)
      $state.go('.', {page : '1', search : query});
    else
      $state.go('.', {page : '1', search : null});
  }

  /**
   * Watching current value of total available returned elements.
   * @param  {Number}
   */
  $scope.$watch("total", function(value){
    $scope.totalPages = Math.ceil(value/$scope.quantity);
  });

  /**
   * Init
   */
  
  if($scope.query != null && $scope.query != undefined && $scope.query.length > 0){

    $scope.users = [];
    $scope.total = 0;
    $scope.page = $scope.page || 1;
    $scope.noResults = false;

    UsersService.count($scope.query).success(function(response){
      $scope.total = response.data.total;    
    });

    $scope.loading = UsersService.search($scope.query, $scope.page, $scope.quantity).success(function(response){

      if(response.results.length == 0)
        $scope.noResults = true;
      else
         $scope.noResults = false;

      $scope.users = response.results;

      for(var i in $scope.users)
        $scope.users[i].fecha_creacion = new Date($scope.users[i].fecha_creacion);

    }).error(function(err){
      console.error(err);
    });

  }else{

    UsersService.count().success(function(response){
      $scope.total = response.data.total;    
    });

    $scope.list($scope.page, $scope.quantity);
  }





});
