
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
	
    var PANEL = d3.select("#sample-metadata");
	PANEL.html("");
	var table = PANEL.append("table")
	console.log(resultArray);
	for (const [key, value] of Object.entries(resultArray[0])) {
	console.log(key, value);
	var tr = table.append("tr")
	tr.append("td").append('strong').text(key.toUpperCase() + " :")
	tr.append("td").text(value)
	
	}
    var result = resultArray[0];

    // PANEL.html("");
    // PANEL.append("h6").text(result.location);
	
	// age: 34
// bbtype: "I"
// ethnicity: "Caucasian/Midleastern"
// gender: "F"
// id: 941
// location: "Chicago/IL"

	
  });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();