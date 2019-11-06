
// create function for data
function buildMetadata(sample) {


  // Use `d3.json` to fetch the metadata for a sample
  let url = `metadata/${sample}` //just some ID of the person

  const metaData = d3.select("#sample-metadata");
  metaData.html("");


  d3.json(url).then(function (data) {
    
    //  figure out where and how to add this...d3.select("tbody").html("")
    // let age = data.Age
    // let bbtype = data.BBTYPE
    // let ethnicity = data.ETHNICITY
    // let gender = data.GENDER
    // let location = data.LOCATION
    // let wfreq = data.WFREQ
    // let sample = data.sample
    //     console.log(age)
    //     console.log(bbtype)
    //     console.log(ethnicity)
    //     console.log(gender)
    //     console.log(location)
    //     console.log(wfreq)
    //     console.log(sample)

        

        const uL = metaData.append('ul');

        Object.entries(data).forEach(function([key, value]) {
          const newLi = uL.append('li');
          newLi.text(`${key}, ${value}`);
        });
  });
};
  // Use d3 to select the panel with id of `#sample-metadata`

  // Use `.html("") to clear any existing  metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = `samples/${sample}` //just some ID of the person
  d3.json(url).then(function (data) {

    let myValues = data.sample_values.slice(0, 10);
    let myLabels = data.otu_ids.slice(0, 10);
    let x_axis = data.otu_ids
    let y_axis = data.sample_values

    //Plotly Pie Chart
    //values labels and type, how to get them.
    var staticdata = [{
      values: myValues,
      labels: myLabels,
      type: 'pie'
    }];

    Plotly.newPlot('pie', staticdata);

    //bubble chart  Need to clarify what OTS_id as color for scatter means.  And how to adjust that.
    
    var trace1 = {
      x: x_axis,
      y: y_axis,
      mode: 'markers',
      marker: {
        color: "#17BECF",
        //opacity: x_axis,
        size: y_axis
      }
    };
    
    var dataBubble = [trace1];
    
    var layout = {
      title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', dataBubble, layout);

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();