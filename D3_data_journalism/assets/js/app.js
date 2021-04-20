var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function Updatetextcircle(textcircle, chosenAxis, LinearScale, axisX ) {
    //alert("voy aca");
    //borrar.remove();
    switch (axisX) {
        case (false):
            console.log("this is the Y axis case")
            textcircle.transition()
            .duration(1000)
            .attr("y", d => LinearScale(d[chosenAxis]));
            break;
        case (true):
            textcircle.transition()
            .duration(1000)
            .attr("x", d => LinearScale(d[chosenAxis]));
            break;
        default:
    }
    return textcircle
}
// function used for updating x-scale var upon click on axis label
function xScale(St_Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(St_Data, d => d[chosenXAxis])* .95,
      d3.max(St_Data, d => d[chosenXAxis])* 1.1
    ])
    .range([0, width])
    .nice();

  return xLinearScale;
}

function yScale(St_Data, chosenYAxis) {
    // create Y scales
    var yLinearScale = d3.scaleLinear()
   .domain([0, d3.max(St_Data, d => d[chosenYAxis])* 1.1])
   .range([height, 0])
   .nice();
  
    return yLinearScale;
  }

   // Create y scale function
   
// function used for updating xAxis var upon click on axis label
function renderAxes(newScale, Axis, asixX) {
  
  if (asixX) {
    var bottomAxis = d3.axisBottom(newScale);
    Axis.transition()
      .duration(1000)
      .call(bottomAxis);
    xAxis=Axis
    return xAxis;
  } else {
      console.log(`voy y axis:${Axis}`)
      var leftAxis = d3.axisLeft(newScale);
      Axis.transition()
      .duration(1000)
      .call(leftAxis);
      yAxis = Axis
      return yAxis;
  }
}

function colorCircle(chosenXAxis){
    
    switch (chosenXAxis) {
        case "poverty":
            color = "#222211"
            break;
        case "age":
            color = "#664033"
            break;
        case "income":
            color = "#334d66"
            break;
        default:
            break;
    }
    return color
}
var colorCir = "#222211"
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newScale, chosenXAxis, axisX) {
    if (axisX) {
        var color = colorCircle(chosenXAxis) // change color circle
        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newScale(d[chosenXAxis]))
        .attr("fill", color)

        return circlesGroup;
    } else {
        circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newScale(d[chosenYAxis]));
        console.log(chosenYAxis)
        return circlesGroup;
    }
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenAxis, circlesGroup, axisX) {

    var labelx;
    var labely;
    switch (axisX) {
        case true:
            labelx=chosenAxis    
            break;
        case false:
            labely = chosenAxis
            break;
        default:
            break;
    }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([60, -50])
    .html(function(d) {
      return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]} <br>${chosenYAxis}: ${d[chosenYAxis]} `);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(St_Data, err) {
  if (err) throw err;

  // parse data
  St_Data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes
    
  });
color = "#222211, 334d00"
  // xLinearScale function above csv import
  var xLinearScale = xScale(St_Data, chosenXAxis);
  var yLinearScale = yScale(St_Data, chosenYAxis);

   // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(St_Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 18)
    .attr("fill", "#222221")
    .attr("opacity", ".7");
    
    var textcircle = chartGroup.append("g")
        .selectAll("text")
        .data(St_Data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .classed("text2", true)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "central")

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var HouseincomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
      var obesityLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        //.classed("axis-text", true)
        .text("Obese (%)");

    var smokesLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        //.classed("axis-text", true)
        .text("Smokes (%)");
        
        var healthcareLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        //.classed("axis-text", true)
        .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, true); // first time poverty vs healthcare tooltips

  // on click function for Y-Axis
  chartGroup.selectAll("text")
  .on("click", function() {
    console.log("Y axis");
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;
    }
    console.log(`esto leo: ${chosenYAxis}`)
    yLinearScale = yScale(St_Data, chosenYAxis);
    yAxis = renderAxes(yLinearScale, yAxis, false);
    circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, false);
    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenYAxis, circlesGroup, false); // if false y-axis
    textcircle = Updatetextcircle(textcircle, chosenYAxis, yLinearScale, false)
    switch (chosenYAxis) {
        case ("healthcare"):
            healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
            obesityLabel
            .classed("active", false)
            .classed("inactive", true);
            smokesLabel
            .classed("active", false)
            .classed("inactive", true);
            break;
        case ("obesity"):
            healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
            obesityLabel
            .classed("active", true)
            .classed("inactive", false);
            smokesLabel
            .classed("active", false)
            .classed("inactive", true);
            break;
        case ("smokes"):
            healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
            obesityLabel
            .classed("active", false)
            .classed("inactive", true);
            smokesLabel
            .classed("active", true)
            .classed("inactive", false);
            break;
        default:
            break;
    }

  })
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(St_Data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis, true);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, true);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, true); // if true x-axis
        textcircle = Updatetextcircle(textcircle, chosenXAxis, xLinearScale, true)

        // changes classes to change bold text
        switch (chosenXAxis) {
            case ("age"):
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                HouseincomeLabel
                .classed("active", false)
                .classed("inactive", true);
                break;
            case ("poverty"):
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                HouseincomeLabel
                .classed("active", false)
                .classed("inactive", true);
                break;
            case ("income"):
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                HouseincomeLabel
                .classed("active", true)
                .classed("inactive", false);
                break;
            default:
                break;
        }
        
        
      }
    });
}).catch(function(error) {
  console.log(error);
});

console.log("1");

