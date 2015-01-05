var viz = function($element,layout,_this) {

	var id = setupContainer($element,layout,"d3vl_slope"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	// build path data
	data.forEach(function(d) {
		d.path = [{x:1,y:d.measure(1).qNum},{ x:2, y:d.measure(2).qNum}];
	});

	// Margins
	var margin = {
		top:40,
		left:30,
		bottom:10,
		right:30
	};

	// size
	var width = ext_width - margin.left - margin.right;
	var height = ext_height - margin.top - margin.bottom;

	// scales
	var x = d3.scale.ordinal()
			.domain([1,2]);

	var y = d3.scale.linear()
			.domain([d3.min(data,function(d) { return Math.min(d.measure(1).qNum, d.measure(2).qNum)}),d3.max(data,function(d) { return Math.max(d.measure(1).qNum, d.measure(2).qNum)})])
			.range([height,0]);

	var line = d3.svg.line()
	    .interpolate("linear")
	    .x(function(d) { return x(d.x); })
	    .y(function(d) { return y(d.y); });

	var svg = d3.select("#" + id).append("svg")
		.attr("width",ext_width)
		.attr("height",ext_height);

	// Determine max label size
	svg.selectAll(".label-left")
		.data(data)
		.enter()
		.append("text")
		.attr("class","label-left")
		.attr("xml:space","preserve")
		.text(function(d) {return d.dim(1).qText + "   " + d.measure(1).qText});

	svg.selectAll(".label-right")
		.data(data)
		.enter()
		.append("text")
		.attr("class","label-right")
		.attr("xml:space","preserve")
		.text(function(d) {return d.dim(1).qText + "   " + d.measure(2).qText});

	svg.append("text")
		.attr("class","title")
		.text(getMeasureLabel(1,layout));

	svg.append("text")
		.attr("class","title")
		.text(getMeasureLabel(2,layout));

	// Get the temp axis max label width
	var label_width = d3.max(svg.selectAll(".label-left, .label-right, .title")[0], function(d) {return d.clientWidth});

	// Remove the temp axis
	svg.selectAll(".label-left, .label-right, .title").remove();

	// Update the margins, plot width, and x scale range based on the label size
	margin.left = margin.left + label_width;
	margin.right = margin.right + label_width;
	width = ext_width - margin.left - margin.right;
	x.rangePoints([0, width]);

	var plot = svg.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	plot.selectAll(".slope")
		.data(data)
		.enter()
		.append("path")
		.attr("class","slope")
		.attr("d",function(d) {return line(d.path);});

	plot.selectAll(".label-left")
		.data(data)
		.enter()
		.append("text")
		.attr("class","label-left")
		.attr("x",x(1)-10)
		.attr("y",function(d) {return y(d.measure(1).qNum)})
		.attr("dy",".3em")
		.attr("xml:space","preserve")
		.text(function(d) {return d.dim(1).qText + "   " + d.measure(1).qText})
		.on("click", function(d) {
			d.dim(1).qSelect();
		});

	plot.selectAll(".label-right")
		.data(data)
		.enter()
		.append("text")
		.attr("class","label-right")
		.attr("x",x(2)+10)
		.attr("y",function(d) {return y(d.measure(2).qNum)})
		.attr("dy",".3em")
		.attr("xml:space","preserve")
		.text(function(d) {return d.measure(2).qText + "   " +  d.dim(1).qText;})
		.on("click", function(d) {
			d.dim(1).qSelect();
		});

	svg.append("text")
		.attr("class","title")
		.text(getMeasureLabel(1,layout))
		.attr("x",x(1)-10 + margin.left)
		.attr("y",10)
		.attr("text-anchor","end");

	svg.append("text")
		.attr("class","title")
		.text(getMeasureLabel(2,layout))
		.attr("x",x(2)+10 + margin.left)
		.attr("y",10)
		.attr("text-anchor","start");

}