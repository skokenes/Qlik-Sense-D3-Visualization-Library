var viz = function($element,layout,_this) {

	var id = senseUtils.setupContainer($element,layout,"d3vl_donut"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var width = ext_width,
	    height = ext_height,
	    radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 70);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.measure_cumulative; });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


	  data.forEach(function(d) {
	    d.measure_cumulative = +d.measure(1).qNum;
	  });

	  var g = svg.selectAll(".arc")
	      .data(pie(data))
	    .enter().append("g")
	      .attr("class", "arc");

	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.dim(1).qText); })
	      .on("click", function(d) {
	      	d.data.dim(1).qSelect();
	      });

	  g.append("text")
	      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.data.dim(1).qText; })
	      .on("click", function(d) {
	      	d.data.dim(1).qSelect();
	      });


}