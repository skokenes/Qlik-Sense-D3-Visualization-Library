var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_zoom_partition"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var root = {name: layout.title, children: senseD3.createFamily(data,dim_count)};

	var w = ext_width,
	    h = ext_height,
	    x = d3.scale.linear().range([0, w]),
	    y = d3.scale.linear().range([0, h]);

	var vis = d3.select("#" + id).append("div")
	    .attr("class", "chart")
	    .style("width", w + "px")
	    .style("height", h + "px")
	  .append("svg")
	    .attr("width", w)
	    .attr("height", h);

	var partition = d3.layout.partition()
	    .value(function(d) { return d.size; });

	var g = vis.selectAll("g")
	      .data(partition.nodes(root))
	    .enter().append("g")
	      .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
	      .on("click", click)
	  	  .on("mouseover", function(d){
	  		d3.selectAll($("."+d.classDim+"#"+d.cssID)).classed("highlight",true);
	      	d3.selectAll($("."+d.classDim+"[id!="+d.cssID+"]")).classed("dim",true);
	      	d3.selectAll($("circle"+"[id!="+d.cssID+"]")).classed("dim",true);
	  	  })
	  	  .on("mouseout", function(d){
	  		d3.selectAll($("."+d.classDim+"#"+d.cssID)).classed("highlight",false);
	      	d3.selectAll($("."+d.classDim+"[id!="+d.cssID+"]")).classed("dim",false);
	      	d3.selectAll($("circle"+"[id!="+d.cssID+"]")).classed("dim",false);
	  	  });

	  var kx = w / root.dx,
	      ky = h / 1;

	g.append("rect")
		.attr("width", root.dy * kx)
		.attr("height", function(d) { return d.dx * ky; })
		.each(function(d){
		  	d.classDim = d.depth > 0 ? layout.qHyperCube.qDimensionInfo[d.depth-1].qFallbackTitle.replace(/\s+/g, '-') : "-";
		  	d.cssID = d.name.replace(/\s+/g, '-');
		})
		.attr("class", function(d) { return d.children ? "parent "+d.classDim : "child "+d.classDim; })
		.attr("id", function(d) { return d.cssID; });

	g.append("text")
		.attr("transform", transform)
		.attr("dy", ".35em")
		.style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
		.text(function(d) { return d.name; })

	d3.select("#" + id)
		.on("click", function() { click(root); })

	function click(d) {
		if (!d.children) return;

		kx = (d.y ? w - 40 : w) / (1 - d.y);
		ky = h / d.dx;
		x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
		y.domain([d.x, d.x + d.dx]);

		var t = g.transition()
			.duration(d3.event.altKey ? 7500 : 750)
			.attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

		t.select("rect")
			.attr("width", d.dy * kx)
			.attr("height", function(d) { return d.dx * ky; });

		t.select("text")
			.attr("transform", transform)
			.style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

		d3.event.stopPropagation();
	}

	function transform(d) {
		return "translate(8," + d.dx * ky / 2 + ")";
	}

}