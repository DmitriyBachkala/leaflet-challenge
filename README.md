# leaflet-challenge

started off by using the code from a previouse in class assignment (15-Mapping/1/10-Stu_GeoJson)


structure for css was found via chat.openai.com

.info.legend {
  background-color: rgba(255, 255, 255, 0.589);
  border: 1px solid #ffbb00;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  color: #000000;
  line-height: 18px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.info.legend h4 {
  margin: 0 0 10px 0;
  color: #000;
}
.info.legend i {
  width: 20px; 
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

color codes were found on https://www.color-hex.com/color-wheel/

  // Function to determine marker color based on depth
  function markerColor(depth) {

    if (depth > 90) return "#400000";
    else if (depth > 70) return "#ff4405";
    else if (depth > 50) return "#ff7a05";
    else if (depth > 30) return "#ffbb05";
    else if (depth > 10) return "#ffe105";
    else return "#ffff05";
  }

and

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
  
