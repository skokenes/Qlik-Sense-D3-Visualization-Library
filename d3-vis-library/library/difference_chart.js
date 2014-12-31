var viz = function($element,layout,_this) {

	var id = setupContainer($element,layout,"d3vl_difference"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y%m%d").parse;

	var x = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.area()
	    .interpolate("basis")
	    .x(function(d) { return  x(d.dim(1).qText); })
	    .y(function(d) { return y(d.measure(1).qNum); });

	var area = d3.svg.area()
	    .interpolate("basis")
	    .x(function(d) { return  x(d.dim(1).qText); })
	    .y1(function(d) { return y(d.measure(1).qNum); });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	x.domain(data.map(function(d) { return d.dim(1).qText; }));
 	y.domain([d3.min(data, function(d) { return Math.min(d.measure(1).qNum,d.measure(2).qNum); }), d3.max(data, function(d) { return Math.max(d.measure(1).qNum,d.measure(2).qNum); })]);

	var label_width = getLabelWidth(yAxis,svg); 	

	// Update the margins, plot width, and x scale range based on the label size
	margin.left = margin.left + label_width;
	width = ext_width - margin.left - margin.right;
	x.rangePoints([0, width]);

	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  plot.datum(data);

	  plot.append("clipPath")
	      .attr("id", "clip-below")
	    .append("path")
	      .attr("d", area.y0(height));

	  plot.append("clipPath")
	      .attr("id", "clip-above")
	    .append("path")
	      .attr("d", area.y0(0));

	  plot.append("path")
	      .attr("class", "area above")
	      .attr("clip-path", "url(" + document.URL + "#clip-above)")
	      .attr("d", area.y0(function(d) { return y(d.measure(2).qNum); }));

	  plot.append("path")
	      .attr("class", "area below")
	      .attr("clip-path", "url(" + document.URL + "#clip-below)")
	      .attr("d", area);

	  plot.append("path")
	      .attr("class", "line")
	      .attr("d", line);

	  plot.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  plot.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text(getMeasureLabel(1,layout));

}