var viz = function($element,layout,_this) {

	var id = setupContainer($element,layout,"d3vl_steam_graph"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var nest = d3.nest()
				.key(function(d) {return d.dim(2).qText})
				.entries(data);

	var width = ext_width,
	    height = ext_height;

	var x = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.dim(1).qText; }))
		.rangePoints([0, width]);

	var stack = d3.layout.stack()
		.offset("wiggle")
	    .values(function(d) { return d.values; })
	    .x(function(d) {return x(d.dim(1).qText); })
	    .y(function(d) {return d.measure(1).qNum; });

	var stacked = stack(nest);

	var y = d3.scale.linear()
	    .domain([0, d3.max(stacked,function(d) { return d3.max(d.values,function(e) { return e.y0 + e.y;})})])
	    .range([height, 0]);

	var color = d3.scale.linear()
	    .range(["#aad", "#556"]);

	var area = d3.svg.area()
	    .x(function(d) { return x(d.dim(1).qText); })
	    .y0(function(d) { return y(d.y0); })
	    .y1(function(d) { return y(d.y0 + d.y); });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width)
	    .attr("height", height);

	svg.selectAll("path")
	    .data(stacked)
	  .enter().append("path")
	    .attr("d", function(d) {return area(d.values);})
	    .style("fill", function() { return color(Math.random()); });

}