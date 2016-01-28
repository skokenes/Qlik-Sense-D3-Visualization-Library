var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_zoomable_circle_packing"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var nest = d3.nest();
	for (var i = 1; i<dim_count; i++) {
		nest = nest.key(createNestingFunction(i));
	};

	nest = {key: "root",values:nest.entries(data)};

	var margin = 20,
	    diameter = Math.min(ext_width,ext_height);

	var color = d3.scale.linear()
	    .domain([-1, 5])
	    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
	    .interpolate(d3.interpolateHcl);

	var pack = d3.layout.pack()
	    .padding(2)
	    .size([diameter - margin, diameter - margin])
	    .value(function(d) { return d.measure(1).qNum; })
	    .children(function(d) { return d.values; });

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", ext_width)
	    .attr("height", ext_height)
	  .append("g")
	    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	var focus = nest,
      nodes = pack.nodes(nest),
      view;

	var circle = svg.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.each(function(d){
			d.classDim = d.depth > 0 ? layout.qHyperCube.qDimensionInfo[d.depth-1].qFallbackTitle.replace(/\s+/g, '-') : "-";
			d.cssID = d.children ? d.key.replace(/\s+/g, '-') : d.dim(dim_count).qText.replace(/\s+/g, '-');
		})
		.attr("class", function(d) { return d.parent ? d.children ? "node "+d.classDim : "node--leaf "+d.classDim : "node node--root"; })
		.attr("id", function(d) { return d.cssID; })
		//.style("fill", function(d) { return d.children ? color(d.depth) : null; })
		.on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
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

	var text = svg.selectAll("text")
		.data(nodes)
		.enter().append("text")
		.attr("class", "label")
		.style("fill-opacity", function(d) { return d.parent === nest ? 1 : 0; })
		.style("display", function(d) { return d.parent === nest ? null : "none"; })
		.text(function(d) { return d.children ? d.key : d.dim(dim_count).qText; });

	var node = svg.selectAll("circle,text");

	d3.select("#" + id)
		//.style("background", color(-1))
		.on("click", function() { zoom(nest); });

	zoomTo([nest.x, nest.y, nest.r * 2 + margin]);

	function zoom(d) {
	    var focus0 = focus; focus = d;

	    var transition = d3.transition()
	        .duration(d3.event.altKey ? 7500 : 750)
	        .tween("zoom", function(d) {
	          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
	          return function(t) { zoomTo(i(t)); };
	        });

	    transition.selectAll("text")
	      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
	        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
	        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
	        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
	  }

	  function zoomTo(v) {
	    var k = diameter / v[2]; view = v;
	    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
	    circle.attr("r", function(d) { return d.r * k; });
	  }

}

function createNestingFunction(index){
  return function(d){ 
            return d.dim(index).qText;
         };
}