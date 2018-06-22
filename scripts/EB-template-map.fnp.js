var MapboxMap = (function() {

  const MAP_TAB_INDEX = 4; // EDIT THIS! index 0 = 1st tab
  const QUERY_NAVBUTTONS = "#navigation button"; // EDIT THIS! query/path to buttons

  var mapExists = false;
  var map = null;

  var geojson = {
      "features": [{
          "type": "Feature",
          "properties": {
              "place_name": "Rheinstrasse 19, 64283 Darmstadt, Germany",
              "location": "Darmstadt"
          },
          "geometry": {
              "coordinates": [8.648691, 49.872638],
              "type": "Point"
          },
          "id": "address.1081757480"
      }, {
          "type": "Feature",
          "properties": {
              "place_name": "Faulbrunnenstrasse 6, 65183 Wiesbaden, Germany",
              "location": "Wiesbaden"
          },
          "geometry": {
              "coordinates": [8.237337, 50.080712],
              "type": "Point"
          },
          "id": "address.1251362007"
      }],
      "type": "FeatureCollection"
  };

  function initMap() {
          mapboxgl.accessToken = "pk.eyJ1IjoiamFucCIsImEiOiJjaXEweHJpaHcwMDIwaTBua2N1OXc3ZDFiIn0.IH9TIUVAKC-XMzX3rpwyZA"; //  Monster Interactive Prague access token, for more info contact Jan Prazak

          if (!mapboxgl.supported()) {
              document.getElementById("myMapboxMap").innerHTML = "Your browser does not support Mapbox GL. For more info click here:<br /><a href='https://www.mapbox.com/help/mapbox-browser-support/' target='_blank'>Mapbox browser support</a>";
          } else {
              map = new mapboxgl.Map({
                  container: "myMapboxMap", // container ID
                  style: "mapbox://styles/mapbox/light-v9",
                  // mapbox://styles/mapbox/light-v9
                  // mapbox://styles/mapbox/streets-v10
                  // mapbox://styles/mapbox/outdoors-v10
                  zoom: 5,
                  minZoom: 5,
                  maxZoom: 17,
                  pitch: 0, // 3D angle
                  center: [10.5, 51.3] // [lng, lat]
              });

              geojson.features.forEach(function(marker) {
                  var el = document.createElement('div');
                  el.className = 'marker';
                  if (!marker.properties.details) {
                      marker.properties.details = "";
                  }
                  if (!marker.properties.email) {
                      marker.properties.email = "";
                  }
                  new mapboxgl.Marker(el)
                      .setLngLat(marker.geometry.coordinates)
                      .setPopup(new mapboxgl.Popup({
                              offset: 25
                          }) // add popups
                          .setHTML('<big>' + marker.properties.location + '</big><p>' + marker.properties.place_name + '</p>'))
                      .addTo(map);
              });
              map.addControl(new mapboxgl.FullscreenControl());

              function setMapLanguage() {
                  if (map.isStyleLoaded()) {
                      console.info("Setting map language (country-label-lg)");
                      map.setLayoutProperty('country-label-lg', 'text-field', ['get', 'name_de']);
                  } else {
                      window.setTimeout(setMapLanguage, 500);
                  }
              }

              setMapLanguage();
          }
      } // end initMap

  function drawMap() {
      if (!mapExists) {
          mapExists = true;
          map.resize();
      }
  }

  document.addEventListener("DOMContentLoaded", function() {
      window.setTimeout(initMap, 150);
      document.querySelectorAll(QUERY_NAVBUTTONS)[MAP_TAB_INDEX].addEventListener("click", function() { window.setTimeout(drawMap, 250); });
  });

})(); // end MapboxMap