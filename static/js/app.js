// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    //console.log(data);

    // get the metadata field
    
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let samplenumberArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a new array that indicates the sample number variable
    let sample_number = samplenumberArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sample_number).forEach(([key, value]) => {
      panel.append("h6").text( `${key.toUpperCase()}: ${value}`);
    })

  });

}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    let samples = data.samples;

    // Filter the samples for the object with the desired sample number

    filtersamplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    filter_sample_number = filtersamplesArray[0];

    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = filter_sample_number.otu_ids;
    let otu_labels = filter_sample_number.otu_ids;
    let sample_values = filter_sample_number.sample_values;

    // Build a Bubble Chart

    let traceBubble = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids
        }
      }
    ];

    let layoutBubble = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    }

    // Render the Bubble Chart

    Plotly.newPlot("bubble", traceBubble, layoutBubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    let traceBar = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    let layoutBar = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"}
    }

    // Render the Bar Chart

    Plotly.newPlot("bar", traceBar, layoutBar);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`

    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    names.forEach((sample) => {
      dropdown
      .append("option")
      .text(sample)
      .property("value", sample);
    })

    // Get the first sample from the list

    firstSample = names[0];

    // Build charts and metadata panel with the first sample

    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
