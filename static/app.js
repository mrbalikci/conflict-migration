function appendTable(name) {
    // extentions of the urls from app.py
    var url_info = "/info/" + name;

    // print it on console 
    //console.log(url_info)

    // append the metadata to the table 
    Plotly.d3.json(url_info, function (error, response) {
        //console.log(response);

        Plotly.d3.select("tbody")
            .html("")
            .selectAll("tr")
            .data(response)
            .enter()
            .append("tr")
            .html(function (d) {
                return `<td>${d.t0}</td><td>${d.t1}</td>`
            })
    })

    var url_years = "/country/" + name;

    Plotly.d3.json(url_years, function (error, yearsData) {

        // define the veriables and data and layout for plotly
        var years = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
            2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
        var valuesAsylum = yearsData.asylum_years;
        var valuesOrigin = yearsData.refugee_years;
        var valuesDeath = yearsData.battle_years;

        var trace1 = {
            x: years,
            y: valuesAsylum,
            type: 'scatter'
        };

        var trace2 = {
            x: years,
            y: yearsData,
            type: 'scatter'
        };

        var trace3 = {
            x: years,
            y: valuesDeath,
            type: 'scatter'
        };

        var data = [trace1, trace2, trace3];

        var layout = {
            title: 'Sample Value Chart',
            height: 700,
            width: 1200
        };

        Plotly.newPlot('plotChart', data, layout);
    });

    Plotly.d3.json(url_years, function (error, yearsData) {

        // variables for pie chart
        var sumAsylum = yearsData.asylum_years.reduce(function (a, b) { return a + b; }, 0);
        var sumOrigin = yearsData.refugee_years.reduce(function (a, b) { return a + b; }, 0);
        var sumDeath = yearsData.battle_years.reduce(function (a, b) { return a + b; }, 0);

        console.log(sumAsylum)
        console.log(sumOrigin)
        console.log(sumDeath)

        var data = [{
            values: [sumAsylum, sumOrigin, sumDeath],
            labels: ['Total Asylum Since 1990', 'Total Refugee Origin Since 1990', 'Total Battle Death Since 1990'],
            type: 'pie'
        }];

        var layout = {
            height: 700,
            width: 900
        };

        Plotly.newPlot('plotPie', data, layout);
    });

    Plotly.d3.json(url_years, function (error, yearsData) {
        var valuesAsylum = yearsData.asylum_years;
        var valuesOrigin = yearsData.refugee_years;
        var valuesDeath = yearsData.battle_years;

        let data = {
            labels: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
                2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],

            datasets: [
                {
                    title: "Number of Asylum",
                    values: valuesAsylum
                },
                {
                    title: "Number of Refugee",
                    values: valuesOrigin
                },
                {
                    title: "Number of Battle Deaths",
                    values: valuesDeath
                }
            ]
        };
        let chart = new Chart({
            parent: "#frappeChart", // or a DOM element
            title: "Asylum, Refugee, and Battle Deaths Chart Since 1990",
            data: data,
            type: 'bar', // or 'line', 'scatter', 'pie', 'percentage',
            height: 250,

            colors: ['#7cd6fd', 'violet', 'blue'],
            // hex-codes or these preset colors;
            // defaults (in order):
            // ['light-blue', 'blue', 'violet', 'red',
            // 'orange', 'yellow', 'green', 'light-green',
            // 'purple', 'magenta', 'grey', 'dark-grey']

            format_tooltip_x: d => (d + '').toUpperCase(),
            format_tooltip_y: d => d

        });
    })


}

var url = "/names";
console.log(url)

function init() {
    Plotly.d3.json(url, function (error, names) {


        var select = Plotly.d3.select('#selDataset')
            .on("change", function () {
                var name = Plotly.d3.select(this).node().value;

                appendTable(name);
            });
        select.selectAll('option')
            .data(names)
            .enter()
            .append('option')

            .text(d => d)
            .attr("value", function (d) { return d; })
    });
}

// run the function 
init();

var url_map = "/data";

d3.json(url_map, function (data) {
    // map work 
   

    // layers
    console.log(url_map)

    var satellite = L.tileLayer(
        "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?" +
        "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
        + "RXRxgZ1Mb6ND-9EYWu_5hA");

    var darkmap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
        + "RXRxgZ1Mb6ND-9EYWu_5hA");

    var streetmap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
        + "RXRxgZ1Mb6ND-9EYWu_5hA");

    var theMarkers = []

    for (var i = 0; i < data.length; i++) {

        var country_lat = data[i].country_lat;
        var country_lon = data[i].country_lon;
        var country_name = data[i].country_name;
        var refugees = data[i].refugees;
        var asylum_seekers = data[i].asylum_seekers;
        var battle_deaths = data[i].battle_deaths;

        // function getColor(d) {
        //     return d > 7 ? '#800026' :
        //         d > 6 ? '#BD0026' :
        //             d > 5 ? '#E31A1C' :
        //                 d > 4 ? '#FC4E2A' :
        //                     d > 3 ? '#FD8D3C' :
        //                         d > 2 ? '#FEB24C' :
        //                             d > 1 ? '#FED976' :
        //                                 '#FFEDA0';
        // }

        theMarkers.push(
            L.circle(([country_lat, country_lon]), {
                stroke: false,
                fillColor: "blue", //getColor(battle_deaths),
                fillOpacity: .75,
                radius: 40
            }))
    }
    var markers = L.layerGroup(theMarkers)

    // console.log(quakes)

    var baseMaps = {
        "Satellite Map": satellite,
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        "Locations": markers,
    }

    var myMap = L.map("map", {
        center: [14.60, -28.67],
        zoom: 5,
        layers: [satellite, markers]
    });

    // function createFeatures(earthquakeData) {

    //     function onEachFeature(feature, layer) {
    //         layer.bindPopup("<h3><center>" + info + " Magnitude " + size +
    //             "</center></h3><hr><p><center>" + new Date(date) + "</center></p>")
    //     };

    //     // geoJSON layer

    //     var earthquakes = L.geoJSON(earthquakeData, {
    //         onEachFeature: onEachFeature
    //     });

    //     createMap(earthquakes);
    // }

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // L.geoJson(quakeMarkers, {
    //     onEachFeature: function (data, layer) {
    //         layer.bindPopup("<h3><center>" + info + " Magnitude " + size +
    //         "</center></h3><hr><p><center>" + new Date(date) + "</center></p>");
    //     }
    // }).addTo(map);

    // Legend Work 
    function getColor(d) {
        return d > 7 ? '#800026' :
            d > 6 ? '#BD0026' :
                d > 5 ? '#E31A1C' :
                    d > 4 ? '#FC4E2A' :
                        d > 3 ? '#FD8D3C' :
                            d > 2 ? '#FEB24C' :
                                d > 1 ? '#FED976' :
                                    '#FFEDA0';
    }

    var legend = L.control({ position: 'bottomright' })

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6, 7],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    }
    legend.addTo(myMap)
})

// end of map 