// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 150,
  bottom: 50,
  left: 150
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

// div for state labels
var texts = d3.select("body").append("div")
   .attr("class","text");

var texts = d3.select("body").append("div")
  .attr("class","yaxis");
  
d3.csv("../data/data.csv").then(function(csvData, error) {
    if (error) throw error;

    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        
    });
    
    var poverty = csvData.map(data => data.poverty);   
  
    var healthcare = csvData.map(data => data.healthcare);
  
  
    var xScale = d3.scaleLinear()
    .domain([d3.min(poverty)-1 , d3.max(poverty)+1])
    .range([0, chartWidth])

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthcare)-1 , d3.max(healthcare)+1])
      .range([chartHeight, 0]);
      
    // text label for the x axis
    svg.append("text")      
      .attr("x", chartWidth -200 )
      .attr("y",  chartHeight + 40 + chartMargin.bottom)
      .style("text-anchor", "middle")
      .text("In Poverty (%) ");

    // text label for y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", chartMargin.left - 50)
      .attr("x",0 - (chartHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Lacks Healthcare");    
      

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .call(leftAxis);
      
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis)
      
    var element = chartGroup.selectAll(".circle")
      .data(csvData)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("fill","lightblue")
      .attr("stroke-width", 5)
      //.text(function(d){return d.abbr})
      // .on("mouseover", function(d) {
      //   tooltip.transition()
      //    .duration(200)
      //    .style("opacity", .9);
    
    var texts2 = chartGroup.selectAll(".text").append("g")
      .data(csvData)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .text(function(d){return d.abbr})
      .style("text-anchor", "middle")

    
})





