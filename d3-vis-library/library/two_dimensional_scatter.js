var viz = function($element, layout, _this) {
	var id = setupContainer($element,layout,"d3vl_two_dim_scatter"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var margin = {top: 20, right: 20, bottom: 30, left: 20},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var x = d3.scale.linear();

	var y = d3.scale.linear()
	    .range([height, 0]);


	  x.domain(d3.extent(data, function(d) { return d.measure(1).qNum; })).nice();
	  y.domain(d3.extent(data, function(d) { return d.measure(2).qNum; })).nice();

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);
	

	var label_width = getLabelWidth(yAxis,svg); 	

	// Update the margins, plot width, and x scale range based on the label size
	margin.left = margin.left + label_width;
	width = ext_width - margin.left - margin.right;
	x.range([0, width]);

	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	  plot.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text(getMeasureLabel(1,layout));

	  plot.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text(getMeasureLabel(2,layout))

	  plot.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", function(d) { return x(d.measure(1).qNum); })
	      .attr("cy", function(d) { return y(d.measure(2).qNum); })
	      .style("fill", function(d) { return color(d.dim(2).qText); })
	      .on("click", function(d) {
	      	d.dim(1).qSelect();
	      })
	      .append("title")
	      .text(function(d) {return getDimLabel(1,layout) + ": " + d.dim(1).qText});

	  var legend = plot.selectAll(".legend")
	      .data(color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });

}