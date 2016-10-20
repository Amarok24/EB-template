var LeafletMap = (function() {

    var mapTabIndex = 1; // EDIT THIS!!! index 0 = 1st tab
    var mapExists = false;

    function initMap() {
        var jsmapMarkers = [
            /* coordY, coordX, title onMouseOver, html content */
            [48.193801, 11.564755, "M\u00FCnchen", "<strong>Company name</strong><br /> \
             Street 123, 80935 M\u00FCnchen, Tel. 0123/555888999<br /> \
            <a href='http://leafletjs.com'>leafletjs.com</a>"],

            [53.5503414, 10.000654, "Hamburg", "<strong>Company name</strong><br /> \
             Street 123, 21129 Hamburg, Tel. 0123/555888999<br /> \
            <a href='http://leafletjs.com' target='_blank'>leafletjs.com</a>"],

            [51.3396, 12.2607, "Leipzig", "<strong>Company name</strong><br /> \
             Street 123, 123456 Leipzig<br /> \
            <a href='http://leafletjs.com' target='_blank'>leafletjs.com</a>"],

            [53.0577, 8.7424, "Bremen", "<strong>Company name</strong><br /> \
             Street 123, 123456 Bremen<br /> \
            <a href='http://leafletjs.com' target='_blank'>leafletjs.com</a>"]
        ];

        L.mapbox.accessToken = 'pk.eyJ1IjoiamFucCIsImEiOiJjaXEweHJpaHcwMDIwaTBua2N1OXc3ZDFiIn0.IH9TIUVAKC-XMzX3rpwyZA'; /* Monster Interactive Prague access token, for more info contact Jan Prazak */

        var jsmap,
            jsmapLayer1,
            jsmapLayer2,
            baseMaps,
            jsmapIcon = L.icon({
                iconUrl: 'http://media.newjobs.com/atge/interactive/js/leaflet077/images/marker-icon.png',
                iconRetinaUrl: 'http://media.newjobs.com/atge/interactive/js/leaflet077/images/marker-icon-2x.png',
                iconSize: [24, 36],
                iconAnchor: [12, 36],
                popupAnchor: [0, -17],
                shadowUrl: 'http://media.newjobs.com/atge/interactive/js/leaflet077/images/marker-shadow.png',
                //shadowRetinaUrl: '',
                shadowSize: [24, 36],
                shadowAnchor: [3, 34]
                });


        function addMarkers()
        {
            for (var i=0; i < jsmapMarkers.length; i++) {
                L.marker([jsmapMarkers[i][0], jsmapMarkers[i][1]],
                {icon: jsmapIcon, title: jsmapMarkers[i][2], opacity: .8}).addTo
                (jsmap).bindPopup(jsmapMarkers[i][3]);
            }
        }

        jsmapLayer1 = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}\u002epng?access_token=' + L.mapbox.accessToken,
            { /* Mapbox Streets */
            maxZoom: 18,
            attribution: '\u00A9 <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>, \u00A9 <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
            /* subdomains: ['','',''], */
            id: 'Map01'
            });

        jsmapLayer2 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}\u002epng',
            { /* OSM */
            maxZoom: 12,
            attribution: '\u00A9 <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
            subdomains: ['a','b','c'], /* OpenStreetMap tile servers */
            id: 'Map02'
            });

        jsmap = L.map('LeafletMap', {
                center: [51.3, 10.6], /* MAP CENTER COORDINATES */
                zoom: 5,
                minZoom: 5,
                scrollWheelZoom: false,
                layers: [jsmapLayer1]
            });

        addMarkers();

        baseMaps = {"Mapbox Streets" : jsmapLayer1, "OpenStreetMap" : jsmapLayer2};
        L.control.layers(baseMaps).addTo(jsmap);
        //jsmapLayer1.addTo(jsmap);
        jsmap.once('focus', function() { jsmap.scrollWheelZoom.enable(); });

    } // end initMap


    function drawMap() {
        if (!mapExists) {
            mapExists = true;
            initMap();
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        /*
        var timeout = (!!window.chrome)? 150 : 0; // 150ms OR 0ms, Chrome bugfix
        setTimeout(initMap, timeout); // Chrome bugfix
        */
        document.querySelectorAll("#navigation button")[mapTabIndex].addEventListener("click", drawMap);
    });


    return {
        /* public objects */
    };

})(); // end LeafletMap
