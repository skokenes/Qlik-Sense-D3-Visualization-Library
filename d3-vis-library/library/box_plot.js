var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_box_plot"),
		ext_width = $element.width(),
		ext_height = $element.height();

	d3.select("#" + id)
		.style("width",ext_width)
		.style("height",ext_height)
		.style("overflow-y","auto");

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var nest = d3.nest()
				.key(function(d) {return d.dim(1).qText})
				.entries(data);

	var flatten = [];
	nest.forEach(function(d,i) {
		d.e = i;
		d.values.forEach(function(e,j) {
			e.r = j;
			e.e = d.e;
			e.s = e.measure(1).qNum;
			flatten.push(e);
		})
	});

	var url = document.location.origin + "/extensions/d3-vis-library/js/box.js";

	// Load in the appropriate script and viz
	jQuery.getScript(url,function() {

		var margin = {top: 30, right: 50, bottom: 20, left: 50},
		    width = 120 - margin.left - margin.right,
		    height = ext_height - margin.top - margin.bottom;

		var min = Infinity,
		    max = -Infinity;

		var box_data = [];
		
		flatten.forEach(function(x) {
		    var e = x.e,
		        r = x.r,
		        s = x.s,
		        d = box_data[e];
		    if (!d) d = box_data[e] = [s];
		    else d.push(s);
		    d.dim = x.dim(1).qText;
		    if (s > max) max = s;
		    if (s < min) min = s;
		  });


		var chart = d3.box()
		    .whiskers(iqr(1.5))
		    .width(width)
		    .height(height);

		chart.domain([min, max]);

		var svg = d3.select("#" + id).selectAll("svg")
			.data(box_data)
			.enter().append("svg")
			.attr("class", "box")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.bottom + margin.top)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(chart);

		svg.append("text")
			.attr("transform","translate(0,-20)")
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.attr("class","title")
			.text(function(d) { return d.dim; });

		// Returns a function to compute the interquartile range.
		function iqr(k) {
		  return function(d, i) {
		    var q1 = d.quartiles[0],
		        q3 = d.quartiles[2],
		        iqr = (q3 - q1) * k,
		        i = -1,
		        j = d.length;
		    while (d[++i] < q1 - iqr);
		    while (d[--j] > q3 + iqr);
		    return [i, j];
		  };
		}

	});

}