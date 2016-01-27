var viz = function($element,layout,_this) {

	var id = senseUtils.setupContainer($element,layout,"d3vl_heatmap"),
		ext_width = $element.width(),
		ext_height = $element.height();

	var data = layout.qHyperCube.qDataPages[0].qMatrix;

	var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

	var dim1 = [];
	var dim2 = [];
	data.forEach(function(d) {
		if (dim1.indexOf(d.dim(1).qText)===-1) {
			dim1.push(d.dim(1).qText);
		}
		if (dim2.indexOf(d.dim(2).qText)===-1) {
			dim2.push(d.dim(2).qText);
		}
	});

	var heat_data = [];

	dim1.forEach(function(d) {

		dim2.forEach(function(e) {
			var temp_val = {dim1: d, dim2: e, value: 0};

			for (var i = 0; i<data.length; i++) {
				if(data[i].dim(1).qText === d && data[i].dim(2).qText === e) {
					temp_val.value = data[i].measure(1).qNum;
					temp_val.data = data[i];
					break;
				}
			}
			heat_data.push(temp_val);
		});
	});

	var color = d3.scale.quantile()
			.domain(d3.extent(heat_data,function(d) {return d.value}))
			.range(colors);
	
	var margin = {
		top: 20,
		left:10,
		bottom:65,
		right:10
	};

	var svg = d3.select("#" + id).append("svg")
			.attr("width",ext_width)
			.attr("height",ext_height);

	svg.selectAll(".temptxt")
		.data(dim2)
		.enter()
		.append("text")
		.attr("class","temptxt")
		.text(function(d) {return d});

	// Get the temp axis max label width
	var label_width = d3.max(svg.selectAll(".temptxt")[0], function(d) {return d.clientWidth});

	// Remove the temp axis
	svg.selectAll(".temptxt").remove();

	// Update the margins, plot width, and x scale range based on the label size
	margin.left = margin.left + label_width;
	margin.right = margin.right + label_width;
	var width = ext_width - margin.left - margin.right;
	var height = ext_height - margin.top - margin.bottom;

	var gridsize = Math.floor(Math.min(width/dim1.length,height/dim2.length));
	var gridwidth = gridsize * dim1.length;
	var gridheight = gridsize * dim2.length;

	var x = d3.scale.ordinal()
			.domain(dim1)
			.rangeRoundBands([0, gridwidth]);
	var y = d3.scale.ordinal()
			.domain(dim2)
			.rangeRoundBands([0,gridheight]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("top");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var plot = svg.append("g")
					.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	plot.selectAll(".square")
			.data(heat_data)
			.enter()
			.append("rect")
			.each(function(d){
				d.classDim1 = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle.replace(/\s+/g, '-');
				d.classDim2 = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle.replace(/\s+/g, '-');
				d.cssID = (d.dim1 + "-" + d.dim2).replace(/\s+/g, '-');
			})
			.attr("class", function(d) { return "square "+d.classDim1+" "+d.classDim2; })
			.attr("id", function(d) { return d.cssID; })
			.attr("x",function(d) {return x(d.dim1)})
			.attr("y",function(d) {return y(d.dim2)})
			.attr("rx",4)
			.attr("ry",4)
			.attr("width",gridsize)
			.attr("height",gridsize)
			.attr("fill",function(d) {return color(d.value)})
			.on("click", function(d) {
				 if(d.value> 0) { 
				 	d.data.dim(1).qSelect();
				 	d.data.dim(2).qSelect();
				 }
			})
	        .on("mouseover", function(d){
	            d3.selectAll($("."+d.classDim1+"."+d.classDim2+"#"+d.cssID)).classed("highlight",true);
		      	d3.selectAll($("."+d.classDim1+"."+d.classDim2+"[id!="+d.cssID+"]")).classed("dim",true);
	        })
	        .on("mouseout", function(d){
	            d3.selectAll($("."+d.classDim1+"."+d.classDim2+"#"+d.cssID)).classed("highlight",false);
		      	d3.selectAll($("."+d.classDim1+"."+d.classDim2+"[id!="+d.cssID+"]")).classed("dim",false);
	        })
			.append("title")
			.text(function(d) {return d.value > 0 ? d.data.measure(1).qText : 0;});

	 plot.append("g")
	      .attr("class", "x axis")
	      .call(xAxis);

	  plot.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)

	var leg_w = 50;
	var leg_h = 20;

	var legend = plot.selectAll(".legend")
		.data([0].concat(color.quantiles()))
		.enter()
		.append("g")
		.attr("class","legend");

	legend.append("rect")
		.attr("x",function(d,i) {return i*leg_w})
		.attr("y",height+20)
		.attr("width",leg_w)
		.attr("height",leg_h)
		.attr("fill",function(d) {return color(d)});

	var format = d3.format(",.0f");

	legend.append("text")
            .attr("class", "mono")
            .text(function(d,i) { return [0,4,8].indexOf(i) >=0 ? "≥ " + format(Math.round(d)) : ""; })
            .attr("x", function(d, i) { return leg_w * i; })
            .attr("y", height + 20 + leg_h *2);
}