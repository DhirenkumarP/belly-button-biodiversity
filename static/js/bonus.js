// ------ BONUS CHALLENGE ------

function buildGauge(patientID) {
    d3.json(url).then(data => {
      
        var metadata = data.metadata;

        // Create a variable that takes the "wfreq" value of the patient ID that matches the current ID selected
        var result = metadata.filter(data => data.id === parseInt(patientID))[0];
        var wfreq = result.wfreq;
        console.log(wfreq);

        // Build the chart
        let gaugeData = [{
            value: parseInt(wfreq),
            title: {
                text: "Washing Frequency per Week"
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10]},
                steps: [
                {range: [0,2], color:"#D98880"},
                {range: [2,4], color:"#E59866"},
                {range: [4,6], color:"F7DC6F"},
                {range: [6,8], color:"#7DCEA0"},
                {range: [8,10], color:"#82E0AA"}
                ]
            }
        }];

        let layout_gauge = {
            autosize: true
        };

        let config_gauge = {
            responsive: true
        };

        Plotly.newPlot("gauge", gaugeData, layout_gauge, config_gauge)
    });
};