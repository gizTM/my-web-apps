// import { thailand } from "./feature.js";

var layerMode = 'normal';
var name = 'chachoengsao';
var latLngs = [];

const normalMask = 'red';
const satelliteMask = 'green';

var paddingX = 10;
var paddingY = 10;

const boundOption = {
  fillOpacity: 0,
  color: '#555',
  weight: 1
};
// credits: https://github.com/turban/Leaflet.Mask
const defaultMaskOption = {
  options: {
    stroke: false,
    color: normalMask,
    fillOpacity: 0.3,
    clickable: true,

    outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
  },

  initialize: function(latLngs, options) {

    var outerBoundsLatLngs = [
      this.options.outerBounds.getSouthWest(),
      this.options.outerBounds.getNorthWest(),
      this.options.outerBounds.getNorthEast(),
      this.options.outerBounds.getSouthEast()
    ];
    L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
  },

};
L.Mask = L.Polygon.extend(defaultMaskOption);
L.mask = function(latLngs, options) {
  return new L.Mask(latLngs, options);
};

const provinceSelect = document.getElementById('province-select');
provinceSelect.innerHTML = `
  ${thailand.features.map(f => `<option value="${f.properties.NAME_1}">${f.properties.NAME_1}</option>`)}
`

const satelliteLayer = document.getElementById('satellite-layout');

const normalLayer = document.getElementById('normal-layout');

const phuketBounds = L.latLngBounds(L.latLng(8.173828125, 98.26171875), L.latLng(7.6904296875, 98.4814453125));
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
satelliteLayer.addEventListener('click', () => {
  layerMode = 'satellite';
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);
  setMaskLayer();
});

normalLayer.addEventListener('click', () => {
  // L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
  //   maxZoom: 20,
  //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  // }).addTo(map);
  layerMode = 'normal';
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  setMaskLayer();
})

// transform geojson coordinates into an array of L.LatLng
var bounds = L.latLngBounds();
var maskLayer;

const setMaskLayer = () => {
  maskLayer.removeFrom(map);
  maskLayer.clearLayers();
  maskLayer.addLayer(L.polygon(latLngs, boundOption));
  const newOptions = {
    options: {
      ...defaultMaskOption.options,
      color: layerMode == 'satellite' ? satelliteMask : normalMask,
    }
  };
  console.log('setMaskLayer: ', layerMode, newOptions.options.color);
  maskLayer.addLayer(L.mask(latLngs, {
    ...defaultMaskOption,
    newOptions,
  }));
  maskLayer.addTo(map);
}

const fixBounds = (name) => {
  var province = thailand.features.find((a) => a.properties.NAME_1.toLowerCase() === name.toLowerCase());
  if (province) {
    console.log('fixBounds: ', province, paddingX, paddingY);
    var coordinates = province.geometry.coordinates;
    latLngs = [];
    if (province.geometry.type === 'Polygon') {
      for (i = 0; i < coordinates[0].length; i++)
        latLngs.push(new L.LatLng(coordinates[0][i][1], coordinates[0][i][0]))
    } else {
      for (i = 0; i < coordinates.length; i++) {
        const tmp = []
        for (j = 0; j < coordinates[i][0].length; j++) {
          /* if (coordinates[i][0].length === 2 && typeof coordinates[i][0][0] === 'number') */
          tmp.push(new L.LatLng(coordinates[i][0][j][1], coordinates[i][0][j][0]));
        }
        latLngs.push(tmp)
      }
    }
    /* const polygon = L.polygon(province) */
    bounds = L.latLngBounds(latLngs)
    /* bounds = polygon.getBounds() */
    map.fitBounds(bounds, {
      padding: [Number(paddingX), Number(paddingY)]
    });
    map.setMaxBounds(bounds);
    console.log(map.getZoom());
    setMaskLayer();
    /* map.setMinZoom(map.getZoom()) */
    map.options.minZoom = map.getZoom() - 2;
  }
}

var map = L.map('map', {
  /* phuket */
  /* center: [13.512826, 100.871435],
  // preferCanvas: true,
  zoom: 10, */
  keyboard: true,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  zoomControl: true,
  scaleControl: true
});
maskLayer = L.layerGroup()
maskLayer.addTo(map);
fixBounds(name);
// L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
//   maxZoom: 20,
//   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
// }).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
L.control.scale().addTo(map);
var provinceName = '';
const provinceInput = document.getElementById('province-input');
provinceInput.addEventListener('change', (e) => {
  name = e.target.value;
  fixBounds(name);
}, false);
const submitBtn = document.getElementById('show-bound-btn');
submitBtn.addEventListener('click', () => {
  fixBounds(name);
})
provinceSelect.addEventListener('change', (e) => {
  name = e.target.value;
  fixBounds(name);
})
// const paddingXInput = document.getElementById('padding-x');
// paddingXInput.addEventListener('change', (e) => {
//   paddingX = Number(e.target.value);
//   fixBounds(name);
// })
// const paddingYInput = document.getElementById('padding-y');
// paddingYInput.addEventListener('change', (e) => {
//   paddingY = Number(e.target.value);
//   fixBounds(name);
// })
