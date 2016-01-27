var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_zoom_treemap"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var root = {name: layout.title, children: senseD3.createFamily(data,dim_count)};

	var w = ext_width - 10,
	    h = ext_height - 10,
	    x = d3.scale.linear().range([0, w]),
	    y = d3.scale.linear().range([0, h]),
	    color = d3.scale.category20c(),
	    //root,
	    node;

	var treemap = d3.layout.treemap()
	    .round(false)
	    .size([w, h])
	    .sticky(true)
	    .value(function(d) { return d.size; });

	var svg = d3.select("#" + id).append("div")
	    .attr("class", "chart")
	    .style("width", w + "px")
	    .style("height", h + "px")
	  .append("svg:svg")
	    .attr("width", w)
	    .attr("height", h)
	  .append("svg:g")
	    .attr("transform", "translate(.5,.5)");


	node = root;

	var nodes = treemap.nodes(root)
		// .filter(function(d) { return !d.children; });

	var cell = svg.selectAll("g")
		.data(nodes)
		.enter().append("svg:g")
		.attr("class", "cell")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.on("click", function(d) { return zoom(node == d.parent ? root : d.parent); })
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

	cell.append("svg:rect")
		.each(function(d){
		  	d.classDim = d.depth > 0 ? layout.qHyperCube.qDimensionInfo[d.depth-1].qFallbackTitle.replace(/\s+/g, '-') : "-";
		  	d.cssID = d.name.replace(/\s+/g, '-');
		})
		.attr("class", function(d) { return d.classDim; })
		.attr("id", function(d) { return d.cssID; })
		.attr("width", function(d) { return d.dx - 1; })
		.attr("height", function(d) { return d.dy - 1; })
		.style("fill", function(d) { return color(d.parent ? d.parent.name : 0); })
		.style("fill-opacity", function(d) { return d.children ? 0 : 1; });

	cell.append("svg:text")
		.attr("x", function(d) { return d.dx / 2; })
		.attr("y", function(d) { return d.dy / 2; })
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.text(function(d) { return d.name; })
		.style("opacity", function(d) { d.w = this.getComputedTextLength(); return !d.children ? d.dx > d.w ? 1 : 0 : 0; });

	d3.select(window).on("click", function() { zoom(root); });

	d3.select("select").on("change", function() {
		treemap.value(this.value == "size" ? size : count).nodes(root);
		zoom(node);
	});

	function size(d) {
	  return d.size;
	}

	function count(d) {
	  return 1;
	}

	function zoom(d) {
	  var kx = w / d.dx, ky = h / d.dy;
	  x.domain([d.x, d.x + d.dx]);
	  y.domain([d.y, d.y + d.dy]);

	  var t = svg.selectAll("g.cell").transition()
	      .duration(d3.event.altKey ? 7500 : 750)
	      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	  t.select("rect")
	      .attr("width", function(d) { return kx * d.dx - 1; })
	      .attr("height", function(d) { return ky * d.dy - 1; })

	  t.select("text")
	      .attr("x", function(d) { return kx * d.dx / 2; })
	      .attr("y", function(d) { return ky * d.dy / 2; })
	      .style("opacity", function(d) { return !d.children ? kx * d.dx > d.w ? 1 : 0 : 0; });

	  node = d;
	  d3.event.stopPropagation();
	}




}

function createNestingFunction(index){
  return function(d){ 
            return d.dim(index).qText;
         };
}
