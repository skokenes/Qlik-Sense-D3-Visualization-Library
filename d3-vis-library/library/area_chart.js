var viz = function($element,layout,_this) {

	var id = setupContainer($element,layout,"d3vl_area"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	// Chart rendering code
	var margin = {top: 20, right: 20, bottom: 30, left: 20},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var parseDate = d3.time.format("%d-%b-%y").parse;

	var x = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var area = d3.svg.area()
	    .x(function(d) { return x(d.dim(1).qText); })
	    .y0(height)
	    .y1(function(d) { return y(d.measure(1).qNum); });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	x.domain(data.map(function(d) { return d.dim(1).qText; }));
 	y.domain([0, d3.max(data, function(d) { return d.measure(1).qNum; })]);

	var label_width = getLabelWidth(yAxis,svg); 	

	// Update the margins, plot width, and x scale range based on the label size
	margin.left = margin.left + label_width;
	width = ext_width - margin.left - margin.right;
	x.rangePoints([0, width]);


	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	plot.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area);

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

};

