// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);

  // Pass the features to both calculateAverageMagnitude() and createFeatures() functions:
  const averageMagnitude = calculateAverageMagnitude(data.features);
  createFeatures(data.features, averageMagnitude);
});

// Function to calculate the average magnitude
function calculateAverageMagnitude(earthquakeData) {
  let sumMagnitude = 0;
  let count = 0;

  earthquakeData.forEach(function (feature) {
    sumMagnitude += feature.properties.mag;
    count++;
  });

  if (count === 0) {
    return 0;
  }

  return sumMagnitude / count;
}

// take the earthquake data and the average magnitude:
function createFeatures(earthquakeData, averageMagnitude) {
  // Function that determines marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 5;
  }

  // Function to determine marker color based on depth
  function markerColor(depth) {

    if (depth > 90) return "#400000";
    else if (depth > 70) return "#ff4405";
    else if (depth > 50) return "#ff7a05";
    else if (depth > 30) return "#ffbb05";
    else if (depth > 10) return "#ffe105";
    else return "#ffff05";
  }

  // Save the earthquake data in a variable.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</p>`);
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      });
    }
  });

  // Pass the earthquake data and average magnitude to createMap() function.
  createMap(earthquakes, averageMagnitude);
}

// Take the earthquake data and the average magnitude:
function createMap(earthquakes, averageMagnitude) {
  // base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // overlays object.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create a new map.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about the map data.
  function createLegend() {
    let legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend');
      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = [
        "#ffff05", // Yellow
        "#ffe105",
        "#ffbb05",
        "#ff7a05",
        "#ff4405",
        "#400000"  // Dark Red
      ]; // Corresponding colors to depth
  
      div.innerHTML += "<h4>Depth</h4>";
  
      // loop through our density intervals
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
  
    return legend;
  }
  
  // Add the legend to the map
  let myMapLegend = createLegend();
  myMapLegend.addTo(myMap);

  // Output the average magnitude to the console.
  console.log(`Average Magnitude: ${averageMagnitude.toFixed(2)}`);
}

