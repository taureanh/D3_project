// @TODO: YOUR CODE HERE!
//declare a function to make website responsive
function makeResponsive() {
    //set up chart
    var svgWidth = 960;
    var svgHeight = 500;
    var margin = {top: 20, right: 40, bottom: 80, left:100};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    //create an SVG wrapper, append an SVG group that will hold our chart
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //retrieve data from data.csv file
    d3.csv("assets/data/data.csv").then(function(healthData){
    console.log(healthData);

    //Cast each variable value in healthData as a number using the unary + operator
        healthData.forEach(function(data) {
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.abbr = data.abbr;
            data.income = +data.income;
        });

    //console.log(healthData);
    //Create scale functions
        var xLinearScale = d3.scaleLinear()
            .domain([8.5, d3.max(healthData, d => d.poverty)])
            .range([0, width]);
    
        var yLinearScale = d3.scaleLinear()
            .domain([3.5, d3.max(healthData, d => d.healthcare)])
            .range([height, 0]);
    
    
    //Create axis functions
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);
    
    //Append axis to the chart
        chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
        chart.append("g")
        .call(yAxis);
        
    //create circles for states
        var circlesGroup = chart.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 16)
            .attr("fill", "lightblue")
            .attr("opacity", ".7")
            .attr("stroke-width", "1")
            .attr("stroke", "black");
    
            chart.select("g")
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("dy",-395)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("fill", "black");
         
            
        //Create tooltip               
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            
            .html(function(d)
                {
                    return `States: ${d.state} <br> Healthcare: ${d.healthcare} <br> Poverty: ${d.poverty}`;
                });
            circlesGroup.call(toolTip);   
 
        //Create mouse-on event 
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data,this)        
        })
        //Create mouse-out event 
        .on("mouseout", function(data) {
        toolTip.hide(data);
     });
        

        //Create labels
        chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - 60)
          .attr("x", 0 -230)
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");
    
        chart.append("text")
          .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
    
    
    
    });
    }
    makeResponsive();