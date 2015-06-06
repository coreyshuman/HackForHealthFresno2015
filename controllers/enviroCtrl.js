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


app.controller("enviroCtrl", ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    
    var unbind = $rootScope.$on('healthCtrl.updateAddress', function(event, arg){
        console.log('enviro got event: ' + arg);
        
        $http.get('dataAccess/enviroData.php?geoId=' + arg).
            success(function(data, status, headers, config) {
                for (row in data)
                {
                    $scope.percentRange = data[row]["CES 2.0 Percentile Range"];
                    $scope.PollutionBurden = data[row]["Pollution Burden Pctl"];
                    $scope.Ozone = data[row]["Ozone Pctl"];
                    $scope.PM25 = data[row]["PM2.5 Pctl"];
                    $scope.Diesel = data[row]["Diesel PM Pctl"];
                    $scope.DrinkingWater = data[row]["Drinking Water Pctl"];
                    $scope.Pesticides = data[row]["Pesticides Pctl"];
                    $scope.ToxicReleases = data[row]["Tox. Release Pctl"];
                    $scope.TrafficDensity = data[row]["Traffic Pctl"];
                    $scope.CleanupSites = data[row]["Cleanup Sites Pctl"];
                    $scope.GroundwaterThreats = data[row]["Groundwater Threats Pctl"];
                    $scope.HazardousWaste = data[row]["Haz. Waste Pctl"];
                    $scope.ImpairedWater = data[row]["Imp. Water Bodies Pctl"];
                    $scope.SolidWaste = data[row]["Solid Waste Pctl"];
                }
            }).
            error(function(data, status, headers, config) {
              console.log("Error updating environment data.");
            });

    });

    $scope.$on('$destroy', unbind);
}]);