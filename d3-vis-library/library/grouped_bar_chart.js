var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_grouped_bar"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	// d3 code
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var x = d3.scale.ordinal();

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .rangeRound([height, 0]);

	//var color = d3.scale.category20();
	var color = d3.scale.ordinal()
					.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
	    //.tickFormat(d3.format(".2s"));

	color.domain(data.map(function(d) {return d.dim(2).qText}));

	var nested_data = d3.nest()
						.key(function(d) {return d.dim(1).qText})
						.entries(data);

	x.domain(nested_data.map(function(d) {return d.key;}));
	y.domain([0,d3.max(data,function(d) {return d.measure(1).qNum;})]);

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	var label_width = getLabelWidth(yAxis,svg);

	svg
		.selectAll(".legend_temp")
		.data(color.domain().slice().reverse())
		.enter().append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.attr("class","legend_temp")
		.style("text-anchor", "end")
		.text(function(d) { return d; });

	var legend_width = d3.max(svg.selectAll(".legend_temp")[0], function(d) {return d.clientWidth});

	// Remove the temp axis
	svg.selectAll(".legend_temp").remove();


	margin.left = margin.left + label_width;
	margin.right = margin.right + legend_width;
	width = ext_width - margin.left - margin.right;
	x.rangeRoundBands([0, width], .1);
	x1.domain(data.map(function(d) {return d.dim(2).qText}))
		.rangeRoundBands([0,x.rangeBand()]);
	  
	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
		.text(senseUtils.getMeasureLabel(1,layout));



	var dim1 = plot.selectAll(".dim1")
		.data(nested_data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"; });

	dim1.selectAll("rect")
		.data(function(d) { return d.values; })
		.enter().append("rect")
		.attr("width", x1.rangeBand())
		.attr("x",function(d) {return x1(d.dim(2).qText);})
		.attr("y", function(d) { return y(d.measure(1).qNum); })
		.attr("height", function(d) { return height - y(d.measure(1).qNum); })
		.style("fill", function(d) { return color(d.dim(2).qText); })
		.on("click",function(d) {
			d.dim(2).qSelect();
		});

	var legend = plot.selectAll(".legend")
		.data(color.domain().slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width + 6 + legend_width)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width + legend_width)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	/**/
}

