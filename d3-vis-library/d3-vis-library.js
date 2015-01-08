define( ["jquery", "text!./d3-vis-library.css","./js/d3.min","./js/senseD3utils","./js/senseUtils","./library/contents"
],
function($, cssContent) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	var lastUsedChart = -1;
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 6,
					qHeight : 1500
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min:0
				},
				measures : {
					uses : "measures",
					min:0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items:{
						ChartDropDown: {
							type: "string",
							component: "dropdown",
							label: "Chart",
							ref: "chart",
							options: content_options,
							defaultValue: 1
						}		
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint: function ($element,layout) {

			var self = this;
			senseUtils.extendLayout(layout,self);
			var dim_count = layout.qHyperCube.qDimensionInfo.length;
			var measure_count = layout.qHyperCube.qMeasureInfo.length;

			if ((dim_count < charts.filter(function(d) {return d.id === layout.chart})[0].min_dims || dim_count > charts.filter(function(d) {return d.id === layout.chart})[0].max_dims) || measure_count < charts.filter(function(d) {return d.id === layout.chart})[0].measures) {
				$element.html("This chart requires " + charts.filter(function(d) {return d.id === layout.chart})[0].min_dims + " dimensions and " + charts.filter(function(d) {return d.id === layout.chart})[0].measures + " measures.");
			}
			else {
				$element.html("");

				if (layout.chart != lastUsedChart) {
					// Determine URL based on chart selection
					var src = charts.filter(function(d) {return d.id === layout.chart})[0].src;
					var url = document.location.origin + "/extensions/d3-vis-library/library/" + src;
					// Load in the appropriate script and viz					
					jQuery.getScript(url,function() {
						viz($element,layout,self);
						lastUsedChart = layout.chart;
					});
				
					
				}
				else {
					viz($element,layout,self);
				}

			}
			
		}
	};

} );


// Helper functions
function getLabelWidth(axis,svg) {
	// Create a temporary yAxis to get the width needed for labels and add to the margin
	svg.append("g")
		.attr("class","y axis temp")
		.attr("transform","translate(0," + 0 + ")")
		.call(axis);

	// Get the temp axis max label width
	var label_width = d3.max(svg.selectAll(".y.axis.temp text")[0], function(d) {return d.clientWidth});

	// Remove the temp axis
	svg.selectAll(".y.axis.temp").remove();

	return label_width;
}