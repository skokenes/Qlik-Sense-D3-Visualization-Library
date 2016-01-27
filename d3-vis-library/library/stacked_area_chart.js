var viz = function($element,layout,_this) {

	var id = senseUtils.setupContainer($element,layout,"d3vl_stacked_area"),
		ext_width = $element.width(),
		ext_height = $element.height(),
		classDim = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle.replace(/\s+/g, '-');

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var margin = {top: 20, right: 20, bottom: 30, left: 20},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var parseDate = d3.time.format("%y-%b-%d").parse,
	    formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal();

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category20();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	color.domain(data.map(function(d) { return d.dim(2).qText; }));

	var nest = d3.nest()
				.key(function(d) {return d.dim(2).qText})
				.entries(data);

	var stack = d3.layout.stack()
	    .values(function(d) { return d.values; })
	    .x(function(d) {return d.dim(1).qText; })
	    .y(function(d) {return d.measure(1).qNum; });

	var stacked = stack(nest);

	var area = d3.svg.area()
	    .x(function(d) { return x(d.dim(1).qText); })
	    .y0(function(d) { return y(d.y0); })
	    .y1(function(d) { return y(d.y0 + d.y); });


	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	x.domain(data.map(function(d) { return d.dim(1).qText; }));
 	y.domain([0, d3.max(stacked,function(d) { return d3.max(d.values,function(e) { return e.y0 + e.y;})})]);

	var label_width = getLabelWidth(yAxis,svg); 	

	// Update the margins, plot width, and x scale range based on the label size
	margin.left = margin.left + label_width;
	width = ext_width - margin.left - margin.right;
	x.rangePoints([0, width]);

	var plot = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var browser = plot.selectAll(".browser")
		.data(stacked)
		.enter().append("g")
		.attr("class", "browser");

	browser.append("path")
		.attr("class", "area "+classDim)
      	.attr("id", function(d) { return d.key; })
		.attr("d", function(d) { return area(d.values); })
		.style("fill", function(d) { return color(d.key); })
		.on("click", function(d) {
			d.values[0].dim(2).qSelect();
		})
		.on("mouseover", function(d){
			d3.selectAll($("."+classDim+"#"+d.key)).classed("highlight",true);
	      	d3.selectAll($("."+classDim+"[id!="+d.key+"]")).classed("dim",true);
		})
		.on("mouseout", function(d){
			d3.selectAll($("."+classDim+"#"+d.key)).classed("highlight",false);
	      	d3.selectAll($("."+classDim+"[id!="+d.key+"]")).classed("dim",false);
		});

	browser.append("text")
		.datum(function(d) { return {name: d.key, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + x(d.value.dim(1).qText) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
		.attr("x", -6)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; })
		.on("click",function(d) {
			d.value.dim(2).qSelect();
		});

	plot.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	plot.append("g")
		.attr("class", "y axis")
		.call(yAxis);


}