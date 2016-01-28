var viz = function($element,layout,_this) {

	var id = senseUtils.setupContainer($element,layout,"d3vl_pie"),
		ext_width = $element.width(),
		ext_height = $element.height(),
		classDim = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle.replace(/\s+/g, '-');

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var width = ext_width,
	    height = ext_height,
	    radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

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
	      .attr("class", classDim)
	      .attr("id", function(d) { return d.data.dim(1).qText; })
	      .style("fill", function(d) { return color(d.data.dim(1).qText); })
	      .on("click", function(d) {
	      	d.data.dim(1).qSelect();
	      })
	      .on("mouseover", function(d){
	      	d3.selectAll($("."+classDim+"#"+d.data.dim(1).qText)).classed("highlight",true);
	      	d3.selectAll($("."+classDim+"[id!="+d.data.dim(1).qText+"]")).classed("dim",true);
	      })
	      .on("mouseout", function(d){
	      	d3.selectAll($("."+classDim+"#"+d.data.dim(1).qText)).classed("highlight",false);
	      	d3.selectAll($("."+classDim+"[id!="+d.data.dim(1).qText+"]")).classed("dim",false);
	      });

	  g.append("text")
	      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.data.dim(1).qText; })
	      .on("click",function(d) {
	      	d.data.dim(1).qSelect();
	      });


}