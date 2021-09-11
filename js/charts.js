function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./json/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./json/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("./json/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
	var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
	var filteredArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3 - 1. Create a variable that filters the metadata array for the object with the desired sample number.
	var filteredMetadata = data.metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSampleArray = filteredArray[0];
    //console.log(firstSampleArray);
	// Deliverable 3 - 2. Create a variable that holds the first sample in the metadata array.
	var firstMetadataArray = filteredMetadata[0];
	console.log(firstMetadataArray);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
	var ids = firstSampleArray.otu_ids;
	var labels = firstSampleArray.otu_labels;
	var sample_values = firstSampleArray.sample_values;

    // Deliverable 3 - 3. Create a variable that holds the washing frequency.
	var wfreq = firstMetadataArray.wfreq;

    // 7. Create the  yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = ids.slice(0,10).map( r => "OTU " + r);
 	var slicedSampleValues =  sample_values.slice(0,10);
	var slicedLabels = labels.slice(0,10);
	
    // // 8. Create the trace for the bar chart. 
	var trace1 = {
		x: slicedSampleValues.reverse(),
		y: yticks.reverse(),
		type: "bar",
		orientation: "h"
	};
	
    var barData = [trace1];
	
	var fontLayout = {
			family: 'Barlow',
			size: 12,
			color: "#ffffff"
	};
    
	// // 9. Create the layout for the bar chart. 
    var barLayout = {
		title: "Top 10 Bacteria Cultures Found",
		plot_bgcolor: "rgba(0,0,0,0)",
		paper_bgcolor: "rgba(0,0,0,0)",
     	font: fontLayout
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
	
	
    // Deliverable 2 - 1. Create the trace for the bubble chart.
    var bubbleData = [
		{
			x: ids,
			y: sample_values,
			text: labels,
		    mode: 'markers',
		    marker: { 
				size: sample_values,
				color: ids.map(c => c*14),
				colorscale: 'Earth'
			  }
		}
    ];

    // Deliverable 2 - 2. Create the layout for the bubble chart.
    var bubbleLayout = {
	  title: 'Bacteria Cultures per Sample',
	  showlegend: false,
	  hovermode:'closest',
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
	  font: fontLayout
	};

    // Deliverable 2 - 3. Use Plotly to plot the data with the layout.	
	Plotly.newPlot('bubble', bubbleData, bubbleLayout);


   // Deliverable 3 - 4. Create the trace for the gauge chart.
    var gaugeData = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: wfreq,
		title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
		legendgrouptitle: { text: "Bela" },
		type: "indicator",
		mode: "gauge+number",
		gauge: {
		  axis: { range: [null, 10] },
		  bar: { color: "black" },
		  steps: [
			{ range: [0, 2], color: "red" },
			{ range: [2, 4], color: "orange" },
			{ range: [4, 6], color: "yellow" },
			{ range: [6, 8], color: "lightgreen" },
			{ range: [8, 10], color: "green" }
		  ]
		}
	}     
    ];
    
    // Deliverable 3 - 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
	   plot_bgcolor: "rgba(0,0,0,0)",
	   paper_bgcolor: "rgba(0,0,0,0)",
       font: fontLayout
    };

    // Deliverable 3 - 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
 
  });
}
