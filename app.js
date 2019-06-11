var svgWidth = 800;
var svgHeight = 600;

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
    .domain(d3.extent(Data, data => data.poverty)).nice();
    var xLinearScale = d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(Data, data => data.healthcare)).nice();

    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare ))
    .attr("cy", d => yLinearScale(d.poverty ))
    .attr("r", "9")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");
    
    chartGroup.append("text")
    .style("font-size", "9px")
    .selectAll("tspan")
    .data(Data)
    .enter()
    .append("tspan")
    .attr("x", function(data) {
          return xLinearScale(data.healthcare - 0.19);
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty - 0.1);
      })
      .text(function(data) {
          return data.abbr
      });
    
      

    
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Health Care: ${d.healthcare}%`);
      });

    
    chartGroup.call(toolTip);

    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

    
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("In Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare(%)");
  });
