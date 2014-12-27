var viz = function($element, layout, _this) {
	var id = setupContainer($element,layout,"d3vl_cluster_dendogram"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var nest = d3.nest();
	for (var i = 1; i<dim_count; i++) {
		nest = nest.key(createNestingFunction(i));
	};

	nest = {key: "root",values:nest.entries(data)};

	// viz
	var width = ext_width,
	    height = ext_height;

	var cluster = d3.layout.cluster()
	    .size([height, width - 160])
	    .children(function(d) {return d.values;});

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(40,0)");

	var nodes = cluster.nodes(nest),
      links = cluster.links(nodes);

    var link = svg.selectAll(".link")
	      .data(links)
	    .enter().append("path")
	      .attr("class", "link")
	      .attr("d", diagonal);

	  var node = svg.selectAll(".node")
	      .data(nodes)
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	  node.append("circle")
	      .attr("r", 4.5);

	  node.append("text")
	      .attr("dx", function(d) { return d.values ? -8 : 8; })
	      .attr("dy", 3)
	      .style("text-anchor", function(d) { return d.values ? "end" : "start"; })
	      //.text("a");
	      .text(function(d) { return d.values ? d.key : d.dim(dim_count).qText; });

}

function createNestingFunction(index){
  return function(d){ 
            return d.dim(index).qText;
         };
}