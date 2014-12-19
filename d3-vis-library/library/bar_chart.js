var viz = function($element, layout, _this) {
	// Properties: height, width, id
	var ext_height = $element.height(),
		ext_width = $element.width(), 
		id = "ext_" + layout.qInfo.qId;

	// Initialize or clear out the container and its classes
	if (!document.getElementById(id)) {
		$element.append($("<div />").attr("id",id));
	}

	else {
	
		$("#" + id)
			.empty()
			.removeClass();

	}

	// Set the containers properties like width, height, and class
	
	$("#" + id)
		.width(ext_width)
		.height(ext_height)
		.addClass("d3vl_bar");

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	// D3 code
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var x = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	var label_width = getLabelWidth(yAxis,svg);

	margin.left = margin.left + label_width;
	width = ext_width - margin.left - margin.right;
	x.rangeRoundBands([0, width], .1);

	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(data.map(function(d) { return getDim(d,1).qText; }));
	y.domain([0, d3.max(data, function(d) { return getMeasure(d,1,layout).qNum; })]);

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

	plot.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(getDim(d,1).qText); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(getMeasure(d,1,layout).qNum); })
	      .attr("height", function(d) { return height - y(getMeasure(d,1,layout).qNum); });
	
};