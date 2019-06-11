var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("Data.csv")
  .then(function(Data) {
    Data.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    
    var yLinearScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(Data, data => data.poverty));
    var xLinearScale = d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(Data, data => data.healthcare))

    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    
      var state_text = "State: "
      var pov_perc = "In Poverty(%): "
      var health_perc = "Healthcare(%): "
      
      // create chartGroup
      chartGroup.selectAll("circle")
          .data(Data)
          .enter()
          .append("circle")
          .attr("cx", function(data, index) {
              return xLinearScale(data.poverty);
          })
          .attr("cy", function(data, index) {
              return yLinearScale(data.healthcare);
          })
          .attr("r", 12)
          .attr("fill", "#0066cc")
          // display tooltip on click
          .on("mouseover", function (data) {
              div.transition()
                  .duration(100)
                  .style("opacity", .9);
              div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.poverty + "<text>%</text>" + "<br/>" + health_perc.bold() + data.healthcare + "<text>%</text>")
                  .style("left", (d3.event.pageX)+ 10 + "px")
                  .style("top", (d3.event.pageY - 0) + "px");
          })
          // hide tooltip on mouseout
          .on("mouseout", function(data, index) {
              div.transition()
                  .duration(500)
                  .style("opacity",0);
          });
  
      chartGroup.append("text")
          .style("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .style("font-family", "arial")
          .selectAll("tspan")
          .data(Data)
          .enter()
          .append("tspan")
              .attr("x", function(data) {
                  return xLinearScale(data.poverty - 0);
              })
              .attr("y", function(data) {
                  return yLinearScale(data.healthcare - 0.1);
              })
              .text(function(data) {
                  return data.abbr
                  });
  
      // Append an SVG group for the xaxis, then display x-axis 
      chartGroup
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
  
      chartGroup.append("g").call(leftAxis);
  
      chartGroup
          .append("text")
          .style("font-family", "arial")
          .style("text-anchor", "middle")
          .style("font-size", "10px")
          .attr("transform", "rotate(-90)")
          .attr("y", 0-margin.left + 20)
          .attr("x", 0 - height/2)
          .attr("dy","1em")
          .attr("class", "axis-text")
          .text("Physically Active (%)");
    
      // Append x-axis labels
      chartGroup
          .append("text")
          .style("font-family", "arial")
          .style("text-anchor", "middle")
          .style("font-size", "10px")
          .attr(
              "transform",
              "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
          )
          .attr("class", "axis-text")
          .text("In Poverty (%)");
  });
