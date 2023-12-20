
var latlngBoundTextArea = document.querySelector('#latlng-list');

var checkBtn = document.querySelector('#check');
var loader = document.querySelector('#loader-container');
let result = [];

let hashRect = [];
let popup1, popup2;

let str = latlngBoundTextArea.textContent;

latlngBoundTextArea.addEventListener('change', function(e) {
  str = e.target.textContent;
});

checkBtn.addEventListener('click', function(e) {
  loader.style.display = 'flex';
  try {
    const b = str;
    console.log(b);
    const bound = JSON.parse(b);
    
    const boundRect = L.polygon([
      bound[0],
      bound[1],
      bound[2],
      bound[3],
    ], {
      color: "#ff0000",
      weight: 1
    });

    L.circleMarker(bound[0], { color: '#ff0000' }).addTo(map);
    L.circleMarker(bound[1], { color: '#fff000' }).addTo(map);
    L.circleMarker(bound[2], { color: '#ff00f0' }).addTo(map);
    L.circleMarker(bound[3], { color: '#00ff00' }).addTo(map);

    map.fitBounds(bound);

    console.log('bound: ', boundRect, bound);

    const pin1 = L.marker(bound[0], { title: '0' });
    const pin2 = L.marker(bound[1], { title: '1' });
    const pin3 = L.marker(bound[2], { title: '2' });
    const pin4 = L.marker(bound[3], { title: '3' });
    boundRect.addTo(map);
    pin1.addTo(map).bindPopup('1')/* .openPopup() */;
    pin2.addTo(map).bindPopup('2')/* .openPopup() */;
    pin3.addTo(map).bindPopup('3')/* .openPopup() */;
    pin4.addTo(map).bindPopup('4')/* .openPopup() */;
    loader.style.display = 'none';
  } catch (e) {
    console.error(e);
    loader.style.display = 'none';
  }
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
// map.on('click', function(e) {
//   if (lockBtn.innerHTML === 'Can click on map, click me!') {
//     if (rect && rect.length === 2 && (isChecking || clickState === 0)) {
//       rect.forEach((r) => r && r.removeFrom(map));
//       hashRect.forEach((r) => r && r.removeFrom(map));
//       rect = [];
//       hashRect = [];
//     }
//     clickState += 1;
//     const {
//       lat,
//       lng
//     } = e.latlng;
//     const hash = Geohash.encode(lat, lng, 7);
//     if (clickState === 1) {
//       nwLatitude.value = lat;
//       nwLongitude.value = lng;
//       nwHash.innerHTML = ' = ' + hash;
//     } else if (clickState > 1) {
//       seLatitude.value = lat;
//       seLongitude.value = lng;
//       seHash.innerHTML = ' = ' + hash;
//       clickState = 0;
//     }
//     const bounds = Geohash.bounds(hash);
//     const temp = L.rectangle([
//       [bounds.ne.lat, bounds.sw.lon],
//       [bounds.sw.lat, bounds.ne.lon]
//     ], {
//       color: "#ff7800",
//       weight: 1
//     });
//     temp.property = hash;
//     temp.on('mouseover', function(e) {
//       popup = L.popup()
//         .setLatLng(e.latlng)
//         .setContent('<p>' + e.target.property + '</p>');
//       popup.openOn(map);
//     });
//     rect.push(temp);
//     temp.addTo(map);
//   }
// });
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
