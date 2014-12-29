var viz = function($element, layout, _this) {
	var id = setupContainer($element,layout,"d3vl_collapsible_force"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;
	/*
	data.forEach(function(d) {
		d.size = d.measure(1).qNum;
	});
*/

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var json = {name: "root", children: senseD3.createFamily(data,dim_count)};

	var w = ext_width,
	    h = ext_height,
	    node,
	    link,
	    root;

	var force = d3.layout.force()
	    .on("tick", tick)
	    .charge(function(d) { return d._children ? -d.size : -30; })
	    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
	    .size([w, h]);

	var radius = d3.scale.linear()
		.domain(d3.extent(data,function(d) {return d.measure(1).qNum;}))
		.range([5,10]);

	var vis = d3.select("#" + id).append("svg")
	    .attr("width", w)
	    .attr("height", h);

	root = json;
	root.fixed = true;
	root.x = w/2;
	root.y = h/2 - 80;
	update();

	function update() {
	  var nodes = flatten(root),
	      links = d3.layout.tree().links(nodes);

	  // Restart the force layout.
	  force
	      .nodes(nodes)
	      .links(links)
	      .start();

	  // Update the links…
	  link = vis.selectAll("line.link")
	      .data(links, function(d) { return d.target.id; });

	  // Enter any new links.
	  link.enter().insert("svg:line", ".node")
	      .attr("class", "link")
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  // Exit any old links.
	  link.exit().remove();

	  // Update the nodes…
	  node = vis.selectAll("circle.node")
	      .data(nodes, function(d) { return d.id; })
	      .style("fill", color);

	  node.transition()
	      .attr("r", function(d) { return d.children ? 4.5 : radius(d.size); });

	  // Enter any new nodes.
	  node.enter().append("svg:circle")
	      .attr("class", "node")
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .attr("r", function(d) { return d.children ? 4.5 : radius(d.size); })
	      .style("fill", color)
	      .on("click", click)
	      .call(force.drag);

	  // Exit any old nodes.
	  node.exit().remove();
	}

	function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	// Color leaf nodes orange, and packages white or blue.
	function color(d) {
	  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update();
	}

	// Returns a list of all nodes under the root.
	function flatten(root) {
	  var nodes = [], i = 0;

	  function recurse(node) {
	    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
	    if (!node.id) node.id = ++i;
	    nodes.push(node);
	    return node.size;
	  }

	  root.size = recurse(root);
	  return nodes;
	}

}