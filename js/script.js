$(function() {
    
    var map = L.map('map').setView([40.65,-73.93], 12);

    // set a tile layer to be CartoDB tiles 
    var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
    attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    // add these tiles to our map
    map.addLayer(CartoDBTiles);

    var acsGeoJSON;
    var nycGeoJSON;

    $.getJSON( "data/acs_data_joined.geojson", function( data ) {
        plotDataset(data);
        loadPointData();
    });

    function plotDataset (bobby) {
        acsGeoJSON = L.geoJson(bobby, {
            style: setMyStyle,
            onEachFeature: bindMyPopup,
        }).addTo(map);
    }

    function setMyStyle(feature) {
        
        var style = {
            weight: 1,
            opacity: .25,
            color: 'grey',
            fillOpacity: 0.75,
            fillColor: styleFillColor(feature),
        }

        return style;

    }

    function styleFillColor (feature) {
        var color;
        var d = feature.properties.ACS_13_5YR_B07201_HD01_VD02;
        
        color = d > 2000 ? '#006d2c' :
                d > 1500 ? '#31a354' :
                d > 1000 ? '#74c476' :
                d > 500  ? '#a1d99b' :
                           '#edf8e9';

        return color;

    }

    function bindMyPopup(feature, layer) {
        layer.on("click", function (event) {
            $('#somethingElse').html("<strong>Number of people living in the same house 1 year ago:</strong> " + feature.properties.ACS_13_5YR_B07201_HD01_VD02);

        });
  
        // layer.bindPopup("<strong>Number of people living in the same house 1 year ago:</strong> " + feature.properties.ACS_13_5YR_B07201_HD01_VD02);
    }


    function loadPointData() {

        $.getJSON( "https://data.cityofnewyork.us/resource/67g2-p84d.geojson?factype=Dance", function( data ) {
            
            nycGeoJSON = L.geoJson(data, {
                pointToLayer: makeCircleMarker,
            })
            .bindPopup(function (layer) {
                return layer.feature.properties.opname;
            })
            .addTo(map);

            setUpListeners();

        });
    
        function makeCircleMarker(feature, latlng) {
            var fillColor;
            if (feature.properties.borocode == 1) {
                fillColor = "purple";
            } else {
                fillColor = "yellow";
            }


            var circle = L.circleMarker(latlng, {
                color: 'white',
                weight: 1,
                fillColor: fillColor,
                fillOpacity: 1,
            });
    
            return circle;
        }


    }

    function setUpListeners() {
        $('#acsData').click(function(){
            if(map.hasLayer(acsGeoJSON)) {
                map.removeLayer(acsGeoJSON)
            } else {
                map.addLayer(acsGeoJSON);
            }
        });

        $('#nycData').click(function(){
            if(map.hasLayer(nycGeoJSON)) {
                map.removeLayer(nycGeoJSON)
            } else {
                map.addLayer(nycGeoJSON);
            }
        });


    }




});