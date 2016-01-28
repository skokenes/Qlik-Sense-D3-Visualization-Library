var viz = function($element, layout, _this) {
	var id = senseUtils.setupContainer($element,layout,"d3vl_treemap"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var dim_count = layout.qHyperCube.qDimensionInfo.length;

	var nested_data = {key:"extension"};

	
	var nest = d3.nest();
	for (var i = 1; i<dim_count; i++) {
		nest = nest.key(createNestingFunction(i));
	};

	nested_data.values = nest.entries(data);	

	// viz
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
	    width = ext_width - margin.left - margin.right,
	    height = ext_height - margin.top - margin.bottom;

	var color = d3.scale.category20c();

	var treemap = d3.layout.treemap()
	    .size([width, height])
	    .sticky(true)
	    .value(function(d) { return d.measure(1).qNum; })
	    .children(function(d) {return d.values;});

	var div = d3.select("#" + id).append("div")
	    .style("position", "relative")
	    .style("width", (width + margin.left + margin.right) + "px")
	    .style("height", (height + margin.top + margin.bottom) + "px")
	    .style("left", margin.left + "px")
	    .style("top", margin.top + "px");

	var node = div.datum(nested_data).selectAll(".node")
      .data(treemap.nodes)
    .enter().append("div")
	  .each(function(d){
	  	d.classDim = d.depth > 0 ? layout.qHyperCube.qDimensionInfo[d.depth-1].qFallbackTitle.replace(/\s+/g, '-') : "-";
	  	d.cssID = d.children ? d.key.replace(/\s+/g, '-') : d.dim(dim_count).qText.replace(/\s+/g, '-');
	  })
	  .attr("class", function(d) { return "node " + d.classDim; })
	  .attr("id", function(d) { return d.cssID; })
      .call(position)
      .style("background", function(d) { return d.values ? color(d.key) : null; })
      .text(function(d) { return d.values ? null : d.dim(dim_count).qText; })
      .on("click", function(d) {
      	if(d.values) {

      	}
      	else {
      		d.dim(dim_count).qSelect();
      	}
      })
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

    function position() {
	  this.style("left", function(d) { return d.x + "px"; })
	      .style("top", function(d) { return d.y + "px"; })
	      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}


}

function createNestingFunction(index){
  return function(d){ 
            return d.dim(index).qText;
         };
}
