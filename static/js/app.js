const url = `https://raw.githubusercontent.com/sarahcasauria/plotly-challenge/main/static/js/samples.json`;

function init() {
   
    var selDropdown = d3.select("#selDataset");
    
    d3.json(url).then(data => {
        
        var patientID = data.names;
        console.log(`------------------------`)
        console.log(`patientID list:`)
        console.log(patientID);

        patientID.forEach(id => {
            selDropdown.append("option").text(id).property("value",id)
               
        });

    // We can now use the first ID from the list to inform the initial plot and metadata table upon page loading
    var firstID = patientID[0];
    console.log(`------------------------`)
    console.log(`firstID variable:`)
    console.log(firstID);
    buildDemographics(firstID);
    buildPlots(firstID)
    buildGauge(firstID);
    });
};

init();

// Get the data from the JSON source again
function buildDemographics(patientID) {
    d3.json(url).then(data => {
        var demoData = data.metadata;
        console.log(`------------------------`)
        console.log(`demoData list:`)
        console.log(demoData);
    
        // Create a variable that filters the sampleData array to match the desired patientID when selected
        var array = demoData.filter(demo => demo.id === parseInt(patientID));
        var patientDemo = array[0];
        console.log(`------------------------`)
        console.log(`patientDemo variable:`)
        console.log(patientDemo);

        // Use the <div> element with "sample-metadata" ID to append the demographic data
        var demographicsBox = d3.select("#sample-metadata");
        demographicsBox.html("");

        // Then append the current ID's demographic data to the box
        Object.entries(patientDemo).forEach(([key, value]) => {
            demographicsBox.append("p").text(`${key}: ${value}`)
        });
    })
};

function buildPlots(patientID) {
    // Get the data from the JSON source again
    d3.json(url).then(data => {
        // Log the data
        console.log(`------------------------`)
        console.log(`data from d3 call:`)
        console.log(data);
        // From the JSON file, put the bacteria sample data into a variable
        var sampleData = data.samples;
        console.log(`------------------------`)
        console.log(`sampleData list:`)
        console.log(sampleData);

        // Create a variable that filters the sampleData array to match the desired patientID when selected
        var array = sampleData.filter(data => data.id === patientID);
        // grab the first lot of data from the resulting array post-filter
        var patientBacData = array[0];
        console.log(`------------------------`)
        console.log(`patientBacData variable:`)
        console.log(patientBacData);

        // Using patientBacData variable, create new variables to store OTU attributes
        var otuIDs = patientBacData.otu_ids;
        console.log(otuIDs);
        var otuLabels = patientBacData.otu_labels;
        console.log(otuLabels);
        var otuValues = patientBacData.sample_values;
        console.log(otuValues);

        // Slice the data to only grab the top 10 OTUs for the patient
        var otuIDs_top10 = otuIDs.slice(0,10).reverse();
        console.log(otuIDs_top10);
        var otuLabels_top10 = otuLabels.slice(0,10).reverse();
        console.log(otuLabels_top10);
        var otuValues_top10 = otuValues.slice(0,10).reverse();
        console.log(otuValues_top10);

        // Plot the horizontal bar chart
        let barData = [{
            x: otuValues_top10,
            y: otuIDs_top10.map(otuID => `OTU ${otuID}`),
            text: otuLabels_top10,
            type: "bar",
            orientation: "h"
        }];

        // Apply title to graph
        let layout_bar = {
            title: 'Top 10 OTUs found',
            autosize: true,
        };

        let config_bar = {
            responsive: true
        };
        // Render the plot with the "bar" ID
        Plotly.newPlot("bar", barData, layout_bar, config_bar);

        // Create a bubble chart that displays each sample.
        let bubbleData = [{
            x: otuIDs,
            y: otuValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: otuValues,
                color: otuIDs
            }
        }];

        // Title the plot
        let layout_bubble = {
            title: "OTU Data",
            autosize: true
        };
        
        let config_bubble = {
            responsive: true
        };

        // Render bubble plot
        Plotly.newPlot("bubble", bubbleData, layout_bubble, config_bubble);
    })
};

buildPlots();

function optionChanged(patientID) {
    buildDemographics(patientID);
    buildPlots(patientID)
    buildGauge(patientID);
}