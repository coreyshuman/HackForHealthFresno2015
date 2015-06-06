<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php
    require_once 'libraries/utilities.php';
?>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>

        <!-- jquery -->
        <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
        
        <!-- angularJS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.min.js"></script>
            
        <!-- bootstrap -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        
        
    </head>
    <body ng-app="myApp" ng-controller="userCtrl">
        <?php
//            $util = new utilities();
            
//            $calenviro = $util->csv_to_array("data/calenvirofinal.csv");
//            echo "calenviro data:</br>";
//            $csv_data = fopen("data/calenvirofinal.csv","r");
//            $lines = explode("\n", $csv_data);
//            $head = str_getcsv(array_shift($lines));
//
//            $array = array();
//            foreach ($lines as $line) {
//                $array[] = array_combine($head, str_getcsv($line));
//            }
//            print_r($calenviro[1]);
        
            echo "Hello World - Fresno Hack For Health!"
        ?>
        
        <div class="container">

            <div ng-include="'views/myUsers_List.html'"></div>
            <div ng-include="'views/myUsers_Form.html'"></div>
        </div>

        <script src = "controllers/myUsers.js"></script>

    </body>
</html>
