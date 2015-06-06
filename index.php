<?php

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
    
    //get url variables
    if(isset($_GET["lat"]))
    {
        $lat = $_GET["lat"];
    }
    if(isset($_GET["lng"]))
    {
        $lng = $_GET["lng"];
    }
    if(isset($_GET["address"]))
    {
        $address = $_GET["address"];
    }
    
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <title>Hack For Health Fresno</title>

        <!-- jquery -->
        <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
        
        <!-- angularJS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.min.js"></script>
            
        <!-- bootstrap -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        
        <!-- Typeahead -->
        <script src="scripts/typeahead.bundle.js"></script>
        
        <!-- Underscore -->
        <script src='https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'></script>
        
        <!-- spinner -->
        <script src='scripts/spin.js'></script>
        
        <!-- handlebars template engine -->
        <script src='scripts/handlebars-v3.0.3.js'></script>
        
        <!-- d3 -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" charset="utf-8"></script>
        
        <!-- Mapbox -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css' rel='stylesheet' />
        <script src='scripts/leaflet.label.js'></script>
        <link href="styles/leaflet.label.css" rel="stylesheet" />
        <script src='scripts/cr-leaflet.js'></script>
        
        <link rel="stylesheet" href="styles/site.css">
        
    </head>
    <body id="healthCtrl" ng-app="healthApp" ng-controller="healthCtrl">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
              <!-- Brand and toggle get grouped for better mobile display -->
              <div class="navbar-header" style='width: 200px;'>
<!--                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </button>-->
                <a class="navbar-brand" href="#">
                    <img src='images/logo_128.jpg' width='40' height='40' alt='Hack For Health'>
                </a>
                  <h4 style='margin-left:40px; margin-top:16px;'>Hack For Health</h4>
              </div>

              <!-- Collect the nav links, forms, and other content for toggling -->
              <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                <form class="navbar-form navbar-left" role="search">
                  <div class="form-group">
                    <input type="text" id='AddressSearch' class='form-control' placeholder="Search" autocomplete='off'>
                  </div>
                </form>
                <ul class="nav navbar-nav navbar-right">
<!--                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Options <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                      <li><a href="#">Action</a></li>
                      <li><a href="#">Another action</a></li>
                      <li><a href="#">Something else here</a></li>
                      <li class="divider"></li>
                      <li><a href="#">Separated link</a></li>
                    </ul>
                  </li>-->
                </ul>
              </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
        
        <div id='body-spinner'></div>
        <div class='container'>
            <div id='MapWindowContainer' class='col-md-7'>
                <div id='MapWindow' class='windowBordered'>
                    <div id='map'></div>
                </div>
            </div>
            <div id='DataWindowContainer' class='col-md-5'>
                <div id='DataWindow' class='windowBordered'>
                    <div role="tabpanel">

                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs" role="tablist">
                      <li role="presentation" class="active"><a href="#census" aria-controls="census" role="tab" data-toggle="tab">Census</a></li>
                      <li role="presentation"><a href="#hospitals" aria-controls="hospitals" role="tab" data-toggle="tab">Hospitals</a></li>
                      <li role="presentation"><a href="#airquality" aria-controls="airquality" role="tab" data-toggle="tab">Environment</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content" style="height:320px; overflow-y: scroll;">
                      <div role="tabpanel" class="tab-pane active" id="census">
                          <div ng-include="'views/census.html'"></div>
                      </div>
                        <div role="tabpanel" class="tab-pane" id="hospitals">
                            <div ng-include="'views/hospitals.html'"></div>
                        </div>
                      <div role="tabpanel" class="tab-pane" id="airquality">
                          <div ng-include="'views/enviro.html'"></div>
                      </div>
                    </div>

                  </div>
                </div>
            </div>
        </div>
        
            
        <script id="place-result-template" type="text/template">
            <li data-geoid="<%= full_geoid %>">
                <a href="/profiles/<%= full_geoid %>">
                    <i class="zoom-to-layer fa fa-arrows-alt" title="Zoom map to fit this shape"></i>
                    <span class="glossary-term identifier"><%= SUMLEVELS[sumlevel].name %></span>
                    <%= full_name %>
                </a>
            </li>
        </script>

        <script src='scripts/main.js'></script>
        <script src='controllers/healthCtrl.js'></script>
        <script src='controllers/censusCtrl.js'></script>
        <script src='controllers/enviroCtrl.js'></script>
        <script src='controllers/hospitalsCtrl.js'></script>
        
        <?php
            // if lat, lng, and address exist we will load them here
            if(isset($lat) && isset($lng) && isset($address))
            {
                echo "<script type='text/javascript'>$(function(){updateLocation($lat,$lng,'$address');});</script>";
            }
            
        ?>
    </body>
</html>