var viz = function($element,layout,_this) {

	var id = senseUtils.setupContainer($element,layout,"d3vl_donut_multiples"),
		ext_width = $element.width(),
		ext_height = $element.height(),
		classDim0 = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle.replace(/\s+/g, '-'),
		classDim1 = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle.replace(/\s+/g, '-');

	d3.select("#" + id)
		.style("width",ext_width)
		.style("height",ext_height)
		.style("overflow-y","auto");

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var nest = d3.nest()
				.key(function(d) {return d.dim(2).qText; })
				.entries(data);


	var width = ext_width,
	    height = ext_height,
	    radius = 74,
    	padding = 10;

	var color = d3.scale.ordinal()
		.domain(data.map(function(d) {return d.dim(1).qText; }))
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius - 30);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.measure(1).qNum; });

	var legend = d3.select("#" + id).append("svg")
		.attr("class", "legend")
		.attr("width", radius * 2)
		.attr("height", radius * 2)
		.selectAll("g")
		.data(color.domain().slice().reverse())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.text(function(d) { return d; });

	var svg = d3.select("#" + id).selectAll(".pie")
		.data(nest)
		.enter().append("svg")
		.attr("class", "pie "+classDim1)
	    .attr("id", function(d) { return d.key; })
		.attr("width", radius * 2)
		.attr("height", radius * 2)
		.append("g")
		.attr("transform", "translate(" + radius + "," + radius + ")");

	svg.selectAll(".arc")
		.data(function(d) { return pie(d.values); })
		.enter().append("path")
		// .attr("class", "arc "+classDim0)
		.attr("class", classDim0)
	    .attr("id", function(d) { return d.data.dim(1).qText; })
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.dim(1).qText); })
		// .style("stroke", "#fff")
		.on("click", function(d) {
	      	d.data.dim(1).qSelect();
	     })
		.on("mouseover", function(d){
			d3.selectAll($("."+classDim0+"#"+d.data.dim(1).qText)).classed("highlight",true);
	      	d3.selectAll($("."+classDim0+"[id!="+d.data.dim(1).qText+"]")).classed("dim",true);
		})
		.on("mouseout", function(d){
			d3.selectAll($("."+classDim0+"#"+d.data.dim(1).qText)).classed("highlight",false);
	      	d3.selectAll($("."+classDim0+"[id!="+d.data.dim(1).qText+"]")).classed("dim",false);
		});

	svg.append("text")
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.text(function(d) { return d.key; })
		.on("click", function(d) {
	      	d.values[0].dim(2).qSelect();
	    })
		.on("mouseover", function(d){
			d3.selectAll($("."+classDim1+"#"+d.key)).classed("highlight",true);
	      	d3.selectAll($("."+classDim1+"[id!="+d.key+"]")).classed("dim",true);
		})
		.on("mouseout", function(d){
			d3.selectAll($("."+classDim1+"#"+d.key)).classed("highlight",false);
	      	d3.selectAll($("."+classDim1+"[id!="+d.key+"]")).classed("dim",false);
		});

}