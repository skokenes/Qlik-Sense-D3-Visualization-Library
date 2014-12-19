define( ["jquery", "text!./d3-vis-library.css","./js/d3.min","./js/senseD3utils","./library/contents"
],
function($, cssContent) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
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
			//add your rendering code here
			//$element.html( "D3 viz library" );
			//console.log(layout);

			// Determine URL based on chart selection
			var src = charts.filter(function(d) {return d.id === layout.chart})[0].src;
			var url = document.location.origin + "/extensions/d3-vis-library/library/" + src;

			// Load in the appropriate script and viz
			jQuery.getScript(url,function() {
				viz($element,layout,this);
			})
		}
	};

} );


// Helper functions
function getDim(d,n) {
	return d[n-1];
};

function getMeasure(d,n,layout) {
	var dim_count = layout.qHyperCube.qDimensionInfo.length;
	return d[dim_count+n-1];
}

function getMeasureLabel(n,layout) {
	return layout.qHyperCube.qMeasureInfo[n-1].qFallbackTitle;
}

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