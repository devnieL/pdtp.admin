'use strict';

/**
* commitments
* @namespace pdtp.admin.controllers
*/

angular
.module('pdtp.admin.controllers')
.controller('CommitmentsCtrl', function ($scope, CommitmentsService, $state, $stateParams){

  $scope.commitments = [];
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
    $scope.loading = CommitmentsService
    .list(page, quantity)
    .success(function(response){
      
      $scope.commitments = response.data;
      for(var i in $scope.commitments)
        $scope.commitments[i].fecha_creacion = new Date($scope.commitments[i].fecha_creacion);

      console.log($scope.commitments);

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

    $scope.commitments = [];
    $scope.total = 0;
    $scope.page = $scope.page || 1;
    $scope.noResults = false;

    CommitmentsService.count($scope.query).success(function(response){
      $scope.total = response.data.total;    
    });

    $scope.loading = CommitmentsService.search($scope.query, $scope.page, $scope.quantity).success(function(response){

      if(response.results.length == 0)
        $scope.noResults = true;
      else
         $scope.noResults = false;

      $scope.commitments = response.results;

      for(var i in $scope.commitments)
        $scope.commitments[i].fecha_creacion = new Date($scope.commitments[i].fecha_creacion);

    }).error(function(err){
      console.error(err);
    });

  }else{
    CommitmentsService.count().success(function(response){
      $scope.total = response.data.total;    
    });

    $scope.list($scope.page, $scope.quantity);
  }

});
