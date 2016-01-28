var viz = function($element,layout,_this) {


	var id = senseUtils.setupContainer($element,layout,"d3vl_aster"),
		ext_width = $element.width(),
		ext_height = $element.height(),
		classDim = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle.replace(/\s+/g, '-');

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var url = document.location.origin + "/extensions/d3-vis-library/js/d3.tip.js";

	// Load in the appropriate script and viz
	jQuery.getScript(url,function() {

		var width = ext_width,
		    height = ext_height,
		    radius = Math.min(width, height) / 2,
		    innerRadius = 0.3 * radius;

		var color =  d3.scale.category20();

		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.measure(1).qNum; });

		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([0, 0])
		  .html(function(d) {
		  	var table;
		  	table = "<table><tr><td>Dimension</td><td><span style='color:orangered'>" + d.data.dim(1).qText + "</span></td></tr><tr><td>" + senseUtils.getMeasureLabel(1,layout) + "</td><td><span style='color:orangered'>" + d.data.measure(1).qText + "</span></td></tr><tr><td>" + senseUtils.getMeasureLabel(2,layout) + "</td><td><span style='color:orangered'>" + d.data.measure(2).qText + "</span></td></tr></table>";
		    return table;
		    //d.data.dim(1).qText + ": <span style='color:orangered'>" + d.data.measure(2).qNum + "</span>";
		  });

		var max_2 = d3.max(data,function(d) {return d.measure(2).qNum});

		var arc = d3.svg.arc()
		  .innerRadius(innerRadius)
		  .outerRadius(function (d) { 
		    return (radius - innerRadius) * (d.data.measure(2).qNum / max_2) + innerRadius; 
		  });

		var outlineArc = d3.svg.arc()
		        .innerRadius(innerRadius)
		        .outerRadius(radius);

		var svg = d3.select("#" + id).append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		svg.call(tip);

		  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
		  
		  var path = svg.selectAll(".solidArc")
		      .data(pie(data))
		    .enter().append("path")
		      .attr("fill", function(d) { return color(d.data.dim(1).qText); })
		      .attr("class", "solidArc "+classDim)
			  .attr("id", function(d) { return d.data.dim(1).qText; })
		      .attr("stroke", "gray")
		      .attr("d", arc)
		      .on('mouseover', tip.show) // these tips don't seem to work
		      .on('mouseout', tip.hide) // these tips don't seem to work
			.on("mouseover", function(d){
				d3.selectAll($("."+classDim+"#"+d.data.dim(1).qText)).classed("highlight",true);
		      	d3.selectAll($("."+classDim+"[id!="+d.data.dim(1).qText+"]")).classed("dim",true);
			})
			.on("mouseout", function(d){
				d3.selectAll($("."+classDim+"#"+d.data.dim(1).qText)).classed("highlight",false);
		      	d3.selectAll($("."+classDim+"[id!="+d.data.dim(1).qText+"]")).classed("dim",false);
			})
		      .on("click", function(d) {
		      	d.data.dim(1).qSelect();
		      });

		  var outerPath = svg.selectAll(".outlineArc")
		      .data(pie(data))
		    .enter().append("path")
		      .attr("fill", "none")
		      .attr("stroke", "gray")
		      .attr("class", "outlineArc")
		      .attr("d", outlineArc);  


	});

}