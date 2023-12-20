var markers = L.markerClusterGroup();

var latlng;

const latlngBoundsInput = document.getElementById('latlng-bound-input');
const reverseLatLngFormat = document.getElementById('reverse-latlng-format');
const showBoundaryOnMap = document.getElementById('show-boundary-on-map');
const showBoundaryAndCenterOnMap = document.getElementById('show-boundary-and-center');

const latInput = document.getElementById('marker-lat');
const lngInput = document.getElementById('marker-lng');

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
const pinMarker = document.getElementById('pin-marker')

const getBounds = () => {
  try {
    const parsedjson = JSON.parse(latlngBoundsInput.value)
    const latlngs = parsedjson.map((e) => 
      reverseLatLngFormat?.checked ? [e[1], e[0]] : [e[0], e[1]]);
    return latlngs;
  } catch (e) {
    console.error('error parsing boundary json: ', e)
    return [];
  }
};
const showArea = () => {
  const latlngs = getBounds();
  L.polygon(latlngs, {color: 'red'}).addTo(map)
  // const lat = latInput.value;
  // const lng = lngInput.value;
  // markerLayer.clearLayers();
  // const m = [lat, lng]; 
  // map.flyTo(m);
  map.flyToBounds(latlngs);
};

const centerMarker = () => {
  const lat = latInput.value;
  const lng = lngInput.value;
  console.log(lat, lng)
  markerLayer.clearLayers();
  const m = [lat, lng]; 
  markerLayer.addLayer(L.marker(m))
  map.flyTo(m);
};

const centerMarkerWithBoundary = () => {
  // center point
  const lat = parseFloat(latInput.value);
  const lng = parseFloat(lngInput.value);
  // area bounding box
  const bounds = getBounds();
  const northestLat = bounds.reduce((acc, b) => {
    return Math.max(acc, b[0]);
  }, bounds[0][0]);
  const southestLat = bounds.reduce((acc, b) => {
    return Math.min(acc, b[0]);
  }, bounds[0][0]);
  const westestLng = bounds.reduce((acc, b) => {
    return Math.min(acc, b[1]);
  }, bounds[0][1]);
  const eastestLng = bounds.reduce((acc, b) => {
    return Math.max(acc, b[1]);
  }, bounds[0][1]);
  const highestFromLatLng = Math.max(
    Math.abs(lat - northestLat),
    Math.abs(lat - southestLat),
  );
  const widestFromLatLng = Math.max(
    Math.abs(lng - westestLng),
    Math.abs(lng - eastestLng),
  );
  // northwestest point
  const nw = [lat+highestFromLatLng, lng-widestFromLatLng]; 
  // northeastest point
  const ne = [lat+highestFromLatLng, lng+widestFromLatLng]; 
  // southwestest point
  const sw = [lat-highestFromLatLng, lng+widestFromLatLng]; 
  // northwestest point
  const se = [lat-highestFromLatLng, lng-widestFromLatLng]; 

  const newRectWithLatlngOnCentroid = [
    nw,
    ne,
    sw,
    se,
  ];
  markerLayer.clearLayers();
  console.log('lat:',lat,'lng:',lng,'\nn:',northestLat, 's:',southestLat, 'w:',westestLng, 'e:',eastestLng, '\nwidest:',widestFromLatLng, 'highest:',highestFromLatLng, 'rect:',newRectWithLatlngOnCentroid);
  
  markerLayer.addLayer(L.marker(nw))
  markerLayer.addLayer(L.marker(ne))
  markerLayer.addLayer(L.marker(sw))
  markerLayer.addLayer(L.marker(se))

  const m = [lat, lng]; 
  markerLayer.addLayer(L.marker(m))
  L.polygon(bounds, {color: 'red'}).addTo(map)
  L.polygon(newRectWithLatlngOnCentroid, {color: 'yellow'}).addTo(map)
  map.flyToBounds(newRectWithLatlngOnCentroid);
};

centerMarkerWithBoundary();

showBoundaryAndCenterOnMap?.addEventListener('click', () => {
  // showArea();
  // centerMarker();
  centerMarkerWithBoundary();
})

showBoundaryOnMap?.addEventListener('click', showArea)
// latlngBoundsInput?.addEventListener('change', showArea)

pinMarker?.addEventListener('click', centerMarker)
latInput.addEventListener('change', (e) => {
  const lat = e.target.value;
  const lng = lngInput.value;
  console.log(lat, lng)
  markerLayer.clearLayers();
  markerLayer.addLayer(L.marker([lat, lng]))
})
lngInput.addEventListener('change', (e) => {
  const lat = latInput.value
  const lng = e.target.value
  console.log(lat, lng)
  markerLayer.clearLayers();
  markerLayer.addLayer(L.marker([lat, lng]))
})
const maxZoom = document.getElementById('max-zoom')
maxZoom.addEventListener('change', (e) => {
  map.setMaxZoom(e.target.value);
})
map.on('click', function(e) {
    const {
      lat,
      lng
    } = e.latlng;
    console.log(lat, lng)
    markerLayer.clearLayers();
    markerLayer.addLayer(L.marker([lat, lng], 
    //   {
    // icon: myIcon(name, color)
    // }
    )
    /* .bindTooltip(name, 
    {
        permanent: true, 
        direction: 'top',
        offset: L.point([0, -20]),
    }) */
    );
    /* markers.addLayer(L.marker(getRandomLatLng(map)));
        map.addLayer(markers); */
    
    latlng = L.LatLng(lat, lng)
    latInput.value = lat
    lngInput.value = lng
});

const satelliteLayer = document.getElementById('satellite-layout');
satelliteLayer.addEventListener('click', () => {

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);
});
const normalLayer = document.getElementById('normal-layout');
normalLayer.addEventListener('click', () => {
  // L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
  //   maxZoom: 20,
  //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  // }).addTo(map);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
})
const tileServerInput = document.getElementById('map-tile')
tileServerInput?.addEventListener('change', (e) => {
  L.tileLayer(e.target.value, {
    maxZoom: 19,
    // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
})
