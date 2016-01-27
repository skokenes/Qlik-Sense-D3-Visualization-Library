var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_radial_tree"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var nest = d3.nest();
	for (var i = 1; i<dim_count; i++) {
		nest = nest.key(createNestingFunction(i));
	};

	nest = {key: layout.title,values:nest.entries(data)};

	// viz
	var diameter = Math.min(ext_width,ext_height);

	var tree = d3.layout.tree()
	    .size([360, diameter / 2 - 120])
	    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; })
	    .children(function(d) {return d.values;});

	var diagonal = d3.svg.diagonal.radial()
	    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter )
	  .append("g")
	    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	var nodes = tree.nodes(nest),
		links = tree.links(nodes);

	var link = svg.selectAll(".link")
		.data(links)
		.enter().append("path")
		.attr("class", "link")
		.attr("d", diagonal);

	var node = svg.selectAll(".node")
		.data(nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

	node.append("circle")
		.each(function(d){
			d.classDim = d.depth > 0 ? layout.qHyperCube.qDimensionInfo[d.depth-1].qFallbackTitle.replace(/\s+/g, '-') : "-";
			d.cssID = d.children ? d.key.replace(/\s+/g, '-') : d.dim(dim_count).qText.replace(/\s+/g, '-');
		})
		.attr("class", function(d) { return d.classDim; })
		.attr("id", function(d) { return d.cssID; })
		.attr("r", 4.5)
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

	node.append("text")
		.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
		.text(function(d) { return d.values ? d.key : d.dim(dim_count).qText; });

}

function createNestingFunction(index){
  return function(d){ 
            return d.dim(index).qText;
         };
}