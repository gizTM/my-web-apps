
var nwHash = document.querySelector('#nw-hash');
var nwLatitude = document.querySelector('#nw-latitude');
var nwLongitude = document.querySelector('#nw-longitude');

var seHash = document.querySelector('#se-hash');
var seLatitude = document.querySelector('#se-latitude');
var seLongitude = document.querySelector('#se-longitude');
var hashDigit = document.querySelector('#hash-digit');
var checkBtn = document.querySelector('#check');
var lockBtn = document.querySelector('#lock');
var showResultBtn = document.querySelector('#show-result');
var loader = document.querySelector('#loader-container');

let isChecking = false;
let result = [];

showResultBtn.addEventListener('click', function(e) {
  // alert(result.map((r) => r.hash));
  const blob = new Blob([JSON.stringify(result.map((r) => r.hash))], {
    type: 'application/json'
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'hash.json');
  document.body.appendChild(link);
  link.click();
  link.remove();
});

lockBtn.addEventListener('click', function(e) {
  lockBtn.innerHTML = lockBtn.innerHTML === 'Can click on map, click me!' ? 'Map is locked, click me!' : 'Can click on map, click me!';
});

hashDigit.value = 7;
hashDigit.addEventListener('change', function(e) {
  hashDigit.value = e.target.value;
});

let hashRect = [];
let popup;

checkBtn.addEventListener('click', function(e) {
  loader.style.display = 'flex';
  const bound = [
    [nwLatitude.value, nwLongitude.value],
    [seLatitude.value, seLongitude.value],
  ];

  // to optimize use webworker -> avoid webpage freeze on calculation
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
  result = Geohash.getHashInBound(bound, hashDigit.value);
  if (result) map.fitBounds(bound);
  (result || []).forEach(function(d) {
    const temp = L.rectangle([
      [d.bound.ne.lat, d.bound.sw.lon],
      [d.bound.sw.lat, d.bound.ne.lon]
    ], {
      color: "#ff0000",
      weight: 1
    });
    temp.property = d.hash;
    temp.on('mouseover', function(e) {
      popup = L.popup()
        .setLatLng(e.latlng)
        .setContent('<p>' + e.target.property + '</p>');
      popup.openOn(map);
    });
    hashRect.push(temp);
    temp.addTo(map);
  });
  loader.style.display = 'none';
  isChecking = true;
});
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
let clickState = 0;
let rect = [];
map.on('click', function(e) {
  if (lockBtn.innerHTML === 'Can click on map, click me!') {
    if (rect && rect.length === 2 && (isChecking || clickState === 0)) {
      rect.forEach((r) => r && r.removeFrom(map));
      hashRect.forEach((r) => r && r.removeFrom(map));
      rect = [];
      hashRect = [];
    }
    clickState += 1;
    const {
      lat,
      lng
    } = e.latlng;
    const hash = Geohash.encode(lat, lng, 7);
    if (clickState === 1) {
      nwLatitude.value = lat;
      nwLongitude.value = lng;
      nwHash.innerHTML = ' = ' + hash;
    } else if (clickState > 1) {
      seLatitude.value = lat;
      seLongitude.value = lng;
      seHash.innerHTML = ' = ' + hash;
      clickState = 0;
    }
    const bounds = Geohash.bounds(hash);
    const temp = L.rectangle([
      [bounds.ne.lat, bounds.sw.lon],
      [bounds.sw.lat, bounds.ne.lon]
    ], {
      color: "#ff7800",
      weight: 1
    });
    temp.property = hash;
    temp.on('mouseover', function(e) {
      popup = L.popup()
        .setLatLng(e.latlng)
        .setContent('<p>' + e.target.property + '</p>');
      popup.openOn(map);
    });
    rect.push(temp);
    temp.addTo(map);
  }
});
const clearHashBtn = document.getElementById('clear-hash-block');
clearHashBtn.addEventListener('click', () => {

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
