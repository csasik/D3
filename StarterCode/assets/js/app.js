// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // @TODO: YOUR CODE HERE!
d3.csv("../data/data.csv").then(function(csvData, error) {
    if (error) throw error;
  
    //console.log(csvData);
    //console.log('end of data');

    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        //  console.log("poverty:", data.poverty);
      });
    
    var poverty = csvData.map(data => data.poverty);   
    //console.log(poverty);

    var healthcare = csvData.map(data => data.healthcare);
  //  console.log("healthcare", healthcare);
  
  
       // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xScale = d3.scaleLinear()
  .domain([d3.min(poverty)-1 , d3.max(poverty)+1])
  .range([0, chartWidth])

// Create a linear scale for the vertical axis.
//console.log(d3.extent(healthcare));

var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthcare)-1 , d3.max(healthcare)+1])
  .range([chartHeight, 0]);

// Create two new functions passing our scales in as arguments
// These will be used to create the chart's axes
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append two SVG group elements to the chartGroup area,
// and create the bottom and left axes inside of them
chartGroup.append("g")
  .call(leftAxis)
  .attr("class", "y axis")
   .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Lacks Healthcare (%)");


chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis)
  .attr("class", "x axis")
    .append("text")
      .attr("class", "label")
      .attr("x", chartWidth)
      .attr("y", -6)
      .text("In Poverty (%)");

// Create one SVG rectangle per piece of tvData
// Use the linear and band scales to position each rectangle within the chart
var element = chartGroup.selectAll(".circle")
  .data(csvData)
  .enter()
  .append("circle")
  .attr("r", 15)
  .attr("cx", d => xScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("fill","lightblue")
  //.attr("stroke", "white")
  .attr("stroke-width", 5)
  .text(function(d){return d.abbr})
  .on("mouseover", function(d) {
    tooltip.transition()
         .duration(200)
         .style("opacity", .9);
    tooltip.html(d["abbr"])
         .style("left", (d3.event.pageX + 5) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
})

// chartGroup.html(function(d) {
//   return (`<text>${d.abbr}</text>`);
// });

    // chartGroup.append("text")
    // .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
    // .attr("class", "axisText")
    // .text("in Poverty");


})
