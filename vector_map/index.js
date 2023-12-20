
var map = L.map('map', {
  center: [13.736717, 100.523186],
  // preferCanvas: true,
  zoom: 6,
  keyboard: true,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  zoomControl: true,
  scaleControl: true,
});

L.vectorGrid.protobuf("http://10.12.0.75:3000/test/{z}/{x}/{y}", {
  getFeatureId: function (feat) {
    return feat.properties.uniqueIdField;
  },
  vectorTileLayerStyles: {
    landuse: {
      weight: 0,
      fillColor: '#9bc2c4',
      fillOpacity: 1,
      fill: true,
    },
    road: [],
    admin: function (properties, zoom) {
      var level = properties.admin_level;
      var weight = 1;
      if (level == 2) { weight = 4; }
      return {
        weight: weight,
        color: '#cf52d3',
        dashArray: '2, 6',
        fillOpacity: 0
      }
    },
    water: function (properties, zoom, geometryDimension) {
      if (geometryDimension === 1) {   // point
        return ({
          radius: 5,
          color: '#3f52d3',
        });
      }

      if (geometryDimension === 2) {   // line
        return ({
          weight: 1,
          color: '#3952d3',
          dashArray: '2, 6',
          fillOpacity: 0
        });
      }

      if (geometryDimension === 3) {   // polygon
        return ({
          weight: 1,
          fillColor: '#9bc2c4',
          fillOpacity: 1,
          fill: true
        });
      }
    },
    place: {
      icon: new L.Icon.Default()
      // icon: new L.circleMarker({
      //   radius: 5,
      //   stroke: false,
      //   color: '#ab62ff'
      // })
    },
    poi: {
      icon: new L.Icon.Default()
    },
    transportation: {
      weight: .1,
      fillColor: '#aaf984',
      fillOpacity: .1,
      fill: true,
    },
    aeroway: {
      weight: .1,
      fillColor: '#9342d4',
      fillOpacity: .1,
      fill: true,
    },
    aerodrome_label: {
      weight: .1,
      fillColor: '#9342d4',
      fillOpacity: .1,
      fill: true,
    },
    park: {
      weight: 1,
      fillColor: '#43ff24',
      fillOpacity: .1,
      fill: true,
    },
    mountain_peak: {
      weight: 4,
      fillColor: '#999999',
      fillOpacity: .1,
      fill: true,
    },
    boundary: {
      weight: .1,
      fillColor: '#934224',
      fillOpacity: .1,
      fill: true,
    },
    landcover: {
      weight: .1,
      fillColor: '#134224',
      fillOpacity: .1,
      fill: true,
    },
  },
  maxNativeZoom: 20
}).addTo(map);

