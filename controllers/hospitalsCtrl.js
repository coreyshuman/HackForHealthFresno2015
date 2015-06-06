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


app.controller("hospitalsCtrl", ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

    $scope.hospInfo = []; 
    $scope.latitude = '';
    $scope.longitude = '';

    //1 deg = ~69 miles
    //10mi = ~.145 long/lat
    $scope.coordRange = .145;

    $scope.getData = function () {
       $scope.coordLowerLong = parseFloat($scope.longitude) - $scope.coordRange;
       $scope.coordUpperLong = parseFloat($scope.longitude) + $scope.coordRange;
       $scope.coordLowerLat = parseFloat($scope.latitude) - $scope.coordRange;
       $scope.coordUpperLat = parseFloat($scope.latitude) + $scope.coordRange;

       $http.get('https://chhs.data.ca.gov/resource/7awe-ix88.json?$select=facility_name,dba_address1,dba_city,dba_zip_code,longitude,latitude&$where=longitude > '+$scope.coordLowerLong.toString()+' and longitude < '+$scope.coordUpperLong.toString()+' and latitude > '+$scope.coordLowerLat.toString()+' and latitude < '+$scope.coordUpperLat.toString())
          .success(function(response) {
             for (eachItemIdx = 0; eachItemIdx <  response.length; eachItemIdx++) {
               $scope.hospInfo.push(response[eachItemIdx]);  
             }
          });
    };
    
    var unbind = $rootScope.$on('healthCtrl.updateAddressLatLng', function(event, arg){
        console.log('hospital got event: ' + arg);
        $scope.coordLowerLong = parseFloat(arg.longitude) - arg.coordRange;
       $scope.coordUpperLong = parseFloat(arg.longitude) + arg.coordRange;
       $scope.coordLowerLat = parseFloat(arg.latitude) - arg.coordRange;
       $scope.coordUpperLat = parseFloat(arg.latitude) + arg.coordRange;
        
        $scope.hospInfo = [];
        $http.get('https://chhs.data.ca.gov/resource/7awe-ix88.json?$select=facility_name,dba_address1,dba_city,dba_zip_code,longitude,latitude&$where=longitude > '+$scope.coordLowerLong.toString()+' and longitude < '+$scope.coordUpperLong.toString()+' and latitude > '+$scope.coordLowerLat.toString()+' and latitude < '+$scope.coordUpperLat.toString()).
            success(function(data, status, headers, config) {
                for (eachItemIdx = 0; eachItemIdx <  data.length; eachItemIdx++) {
                    $scope.hospInfo.push(data[eachItemIdx]);  
                  }
            }).
            error(function(data, status, headers, config) {
              console.log("Error updating hospital data.");
            });

    });

    $scope.$on('$destroy', unbind);
}]);
