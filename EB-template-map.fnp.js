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

        var jsmap,
            jsmapLayer1,
            jsmapLayer2,
            jsmapLayer3,
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

        jsmapLayer1 = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
            { /* MapQuest */
            maxZoom: 18,
            attribution: '\u00A9 <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>',
            subdomains: ['otile1','otile2','otile3','otile4'], /* MapQuest-Open tile servers */
            id: 'Map01'
            });

        jsmapLayer2 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { /* OSM */
            maxZoom: 18,
            attribution: '\u00A9 <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
            subdomains: ['a','b','c'], /* OpenStreetMap tile servers */
            id: 'Map02'
            });

        jsmapLayer3 = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
            { /* Thunderforest */
            maxZoom: 18,
            attribution: 'Maps \u00A9 <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>, Data \u00A9 <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
            subdomains: ['a','b','c'], /* Thunderforest tile servers */
            id: 'Map03'
            });

        jsmap = L.map('LeafletMap', {
                center: [51.3, 10.6], /* MAP CENTER COORDINATES */
                zoom: 6,
                minZoom: 5,
                scrollWheelZoom: false,
                layers: [jsmapLayer1]
            });

        addMarkers();

        baseMaps = {"MapQuest" : jsmapLayer1, "OpenStreetMap" : jsmapLayer2, "Thunderforest" : jsmapLayer3};
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
