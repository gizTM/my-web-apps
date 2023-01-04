var markers = L.markerClusterGroup();

var map = L.map('map', {
  /* phuket */
  center: [13.736717, 100.523186],
  // preferCanvas: true,
  zoom: 10,
  keyboard: true,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  zoomControl: true,
  scaleControl: true,
});
/* L.tileLayer(
  "https://ms.longdo.com/mmmap/tile.php?zoom={z}&x={x}&y={y}&key=covid19&proj=epsg3857&HD=1",
  {
    attribution: "© Longdo Map",
    minNativeZoom: 5,
    maxNativeZoom: 20,
    minZoom: 5,
    maxZoom: 22
  }
).addTo(map); */
// L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
//   maxZoom: 20,
//   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
// }).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
L.control.scale().addTo(map);
var myIcon = (name, c) => false ? 
	L.icon({
		className: 'marker-'+c,
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Map_marker_font_awesome.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 65],
    /* popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94] */
}) : L.divIcon({
        className: 'marker-'+c,
        iconSize: [38, 95],
        iconAnchor: [22, 65],
        html: '<div class="marker-icon" data-color="'+c+'"><svg width="573.61" height="745.07" transform="scale(0.1), translate(-2700,-3300)"><path xmlns="http://www.w3.org/2000/svg" d="m348.8 0c120.17 0 216.31 96.137 216.31 213.91 0 129.79-122.57 165.84-197.08 334.08-7.2109 14.422-28.84 14.422-36.051 0-76.91-168.24-197.08-204.29-197.08-334.08 0-117.77 96.137-213.91 213.91-213.91zm0 134.59c45.664 0 81.715 36.051 81.715 79.312 0 45.664-36.051 81.715-81.715 81.715-43.262 0-79.312-36.051-79.312-81.715 0-43.262 36.051-79.312 79.312-79.312z" fill-rule="evenodd"/></svg><div class="marker-label">'+name+'</div></div>'
        /* html: '<img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Map_marker_font_awesome.svg" width="40" />' */
    });
    
const colors = ['red', 'green', 'blue', 'purple', 'pink'];
let markerList = [];
const markerLayer = L.layerGroup();
const markerListTextArea = document.getElementById('marker-list');
markerLayer.addTo(map);
map.on('click', function(e) {
    const {
      lat,
      lng
    } = e.latlng;
    const color = colors[Math.floor((Math.random()*10)%colors.length)];
    const name = 'm'+markerList.length;
    markerList.push(L.LatLng(lat, lng));
    markerListTextArea.value += lat + ', ' + lng + ' ; ' + 'name: '+name + ', color: '+ color + '\n';
    markerLayer.addLayer(L.marker([lat, lng], {
    icon: myIcon(name, color)
    })
    /* .bindTooltip(name, 
    {
        permanent: true, 
        direction: 'top',
        offset: L.point([0, -20]),
    }) */
    );
    /* markers.addLayer(L.marker(getRandomLatLng(map)));
        map.addLayer(markers); */
});
const clearMarkerBtn = document.getElementById('clear-marker-list');
clearMarkerBtn.addEventListener('click', () => {
	markerList = [];
  markerLayer.clearLayers();
  markerListTextArea.value = '';
});
const satelliteLayer = document.getElementById('satellite-layout');
satelliteLayer.addEventListener('click', () => {

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);
});
const normalLayer = document.getElementById('normal-layout');
normalLayer.addEventListener('click', () => {
  L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);
})
