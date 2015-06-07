/* 
 * Copyright (C) 2015 JCore Engineering
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */


app.controller("censusCtrl", ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    $scope.PopInfo = "";
    $scope.IncInfo = "";
    $scope.AgeInfo = "";
    $scope.EduHSInfo = "";
    $scope.curTract = "";

    $scope.censusTableIDs = {
       'B01003':'PopInfo',
       'B19013':'IncInfo',
       'B01002':'AgeInfo',
       'B17001':'PovInfo'
    };
    tableSet = '';
  
    for (eachKey in $scope.censusTableIDs) {
      if (tableSet == '')
        tableSet = eachKey;
      else
        tableSet = tableSet + ',' + eachKey;
    }

    $scope.getData = function () {
       $http.get('http://api.censusreporter.org/1.0/data/show/latest?table_ids='+tableSet+'&geo_ids='+$scope.curTract+'&primary_geo_id='+$scope.curTract)
          .success(function(response) {
             for (eachKey in $scope.censusTableIDs) {
               $scope[$scope.censusTableIDs[eachKey]] = response['data'][$scope.curTract][eachKey]['estimate'][eachKey+'001'];
             }
          });
    }

    var unbind = $rootScope.$on('healthCtrl.updateAddress', function(event, arg){
       //$scope.getData = function () {
          $http.get('http://api.censusreporter.org/1.0/data/show/latest?table_ids='+tableSet+'&geo_ids='+arg+'&primary_geo_id='+arg)
             .success(function(response) {
                 console.log("AABAB")
                for (eachKey in $scope.censusTableIDs) {
                  $scope[$scope.censusTableIDs[eachKey]] = response['data'][arg][eachKey]['estimate'][eachKey+'001'];
                }
             });
       //}




    });

    $scope.$on('$destroy', unbind);
}]);