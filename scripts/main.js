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

CR_API_URL = 'http://api.censusreporter.org';
var thisSumlev = '140'; // CTS hardcode for now
var thisGeoID = null;
L.mapbox.accessToken = 'pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA';


$(function() {

var GEOCODE_URL = _("http://api.tiles.mapbox.com/v4/geocode/mapbox.places/<%=query%>.json?access_token=<%=token%>").template();
var REVERSE_GEOCODE_URL = _("http://api.tiles.mapbox.com/v4/geocode/mapbox.places/<%=lng%>,<%=lat%>.json?access_token=<%=token%>").template();

var PLACE_LAYERS = {};
var geoSearchAPI = 'http://api.censusreporter.org/1.0/geo/search';
var place_template = _.template($("#place-result-template").html());
var push_state_url_template = _.template("?lat=<%=lat%>&lng=<%=lng%>&address=<%=address%>");
var push_state_title_template = _.template("Census Reporter: Geographies containing <%= address %> (<%=lat%>, <%=lng%>)");
var $searchInput = $("#AddressSearch");



var lat = '',
    lng = '',
    address = '',
    point_marker = null,
    map = null;

// prepare spinner
$('body').append('<div id="body-spinner"></div>');
var spinnerTarget = document.getElementById('body-spinner');
    spinner = new Spinner();

window.onpopstate = function(event) {
    if (event.state) {
        var lat = event.state.lat;
        var lng = event.state.lng;
        var address = event.state.address;
        if (lat && lng) {
            updateLocation(lat, lng, address);
        }
    }
}
function updateLocation(lat, lng, label) {
    if (!label) {
        reverseGeocode({lat: lat, lng: lng}, function(label) {
            updateLocation(lat, lng, label);
        })
    } else {
        setMap(lat, lng);
        //findPlaces(lat, lng, label);
        placeMarker(lat, lng, label);
        // CTS DEBUG
        $.ajax({
            url: CR_API_URL + "/1.0/geo/search?lat=" + lat + "&lon=" + lng + "&sumlevs=140&geom=true",
            cache: false
          })
            .done(function( resp ) {
              if(resp.results.length > 0)
              {
                  thisGeoID = resp.results[0]["full_geoid"];
                addMapOverlay(thisGeoID);
               }
            });

        var state = {lat: lat, lng: lng, address: label}
        if (!(_.isEqual(history.state,state))) {
            history.pushState(state,push_state_title_template(state),push_state_url_template(state));
        }
    }
}

function processGeocoderResults(response) {
    var results = response.features;
    results = _.filter(results, function(item) { return item.id.indexOf('address.') == 0; });
    results = _.map(results, function(item) { 
        item.place_name = item.place_name.replace(", United States", ""); 
        return item;
    });
    return results;
}

var addressSearchEngine = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 20,
    remote: {
        url: GEOCODE_URL,
        replace: function (url, query) {
            return url({query: query, token: L.mapbox.accessToken});
        },
        filter: processGeocoderResults
    }
});
addressSearchEngine.initialize();

function selectAddress(obj, datum) {
    $searchInput.typeahead('val', '');
    if (datum.geometry) {
        var label = datum.place_name.replace(", United States", "");
        if (datum.geometry.type == "Point") {
            var lng = datum.geometry.coordinates[0];
            var lat = datum.geometry.coordinates[1];
        } else if (datum.center) {
            var lng = datum.center[0];
            var lat = datum.center[1];
        } else {
            console.log("Don't know how to handle selection.");
            window.selection_error = datum;
            return false
        }
        updateLocation(lat, lng, label);
    } else {
        console.log("Don't know how to handle selection.");
        window.selection_error = datum;
        return false;
    }
}

function makeAddressSearchWidget(element) {
    element.typeahead('destroy');
    element.typeahead({
        autoselect: false,
        highlight: false,
        hint: false,
        minLength: 3
    }, {
        name: 'addresses',
        displayKey: 'place_name',
        source: addressSearchEngine.ttAdapter(),
        templates: {
            suggestion: Handlebars.compile(
                '<p class="result-name">{{place_name}}</p>'
            )
        }
    });

    element.on('typeahead:selected', selectAddress);
}

makeAddressSearchWidget($searchInput);

function setMap(lat, lng) {
    console.log('a');
    if (map) {
        console.log('b', lat, lng);
        var map_center = new L.latLng(lat, lng);
        map.panTo(map_center);
    }
}

function placeMarker(lat, lng, label) { 
    if (map) {
        if (point_marker) {
            point_marker.hideLabel();
            point_marker.getLabel().setContent(label);
            point_marker.setLatLng(L.latLng(lat,lng));
        } else {
            point_marker = new L.CircleMarker(L.latLng(lat,lng),{ fillColor: "#66c2a5", fillOpacity: 1, stroke: false, radius: 5});
            map.addLayer(point_marker);
            point_marker.bindLabel(label, {noHide: true});
        }
        point_marker.showLabel();
    }

}

L.mapbox.accessToken = 'pk.eyJ1IjoiY3NodW1hbiIsImEiOiI3ZmExNTBkZWVmMDlkNjQxNTQ4NzZhNWE3Yjk1NDhmZiJ9.mU8bpbdXsk5rDo6CLHoy7g';
        var map = L.mapbox.map('map', 'mapbox.streets')
            .setView([36.7500, -119.7667], 11);


function addMapOverlay(geo_id) {
    // Make the header map
    d3.json(CR_API_URL + '/1.0/geo/tiger2013/' + geo_id + '?geom=true', function(error, json) {
        if (error) return console.warn(error);


        if (CensusReporter.SummaryLevelLayer && thisSumlev !== "010") {
            var defaultStyle = {
                    "clickable": true,
                    "color": "#00d",
                    "fillColor": "#ccc",
                    "weight": 1.0,
                    "opacity": 0.3,
                    "fillOpacity": 0.3,
                },
            geojsonTileLayer = new CensusReporter.SummaryLevelLayer(thisSumlev, {}, 
                {
                style: defaultStyle,
                onEachFeature: function(feature, layer) {
                    if (feature.properties.geoid == thisGeoID)
                        return;

                    layer.bindLabel(feature.properties.name, {direction: 'auto'});
                    layer.on('mouseover', function() {
                        layer.setStyle({
                            "fillOpacity": 0.5,
                        });
                    });
                    layer.on('mouseout', function() {
                        layer.setStyle(defaultStyle);
                    });
                    layer.on('click', function() {
                        window.location.href = '/profiles/' + feature.properties.geoid + '-' + slugify(feature.properties.name);
                    });
                }
            });
            map.addLayer(geojsonTileLayer);
        }

        var featureLayer = L.geoJson(json, {
            style: {
                "fillColor": "#66c2a5",
                "color": "#777",
                "weight": 2,
                "clickable": false
            }
        });
        map.addLayer(featureLayer);
        var objBounds = featureLayer.getBounds();

        if (thisSumlev === "010") {
            objBounds = L.latLngBounds(L.latLng(24.396, -124.849), L.latLng(49.384, -66.885));
        }

        if ($(window).width() > 768) {
            var z;
            for(z = 16; z > 2; z--) {
                var swPix = map.project(objBounds.getSouthWest(), z),
                    nePix = map.project(objBounds.getNorthEast(), z),
                    pixWidth = Math.abs(nePix.x - swPix.x),
                    pixHeight = Math.abs(nePix.y - swPix.y);
                if (pixWidth <  500 && pixHeight < 400) {
                    break;
                }
            }

            map.setView(objBounds.getCenter(), z);
            map.panBy([-270, 0], {animate: false});
        } else {
            map.fitBounds(objBounds);
        }
    });
}

}); // $(function)
