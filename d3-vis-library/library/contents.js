var charts = [
	{
		name:"Bar Chart",
		id:1,
		src:"bar_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Grouped Bar Chart",
		id:2,
		src:"grouped_bar_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Stacked Bar Chart",
		id:3,
		src:"stacked_bar_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Normalized Stacked Bar Chart",
		id:4,
		src:"normalized_stacked_bar_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Line Chart",
		id:5,
		src:"line_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Multi-Series Line Chart",
		id:6,
		src:"multi_series_line_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Area Chart",
		id:7,
		src:"area_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Bivariate Area Chart",
		id:8,
		src:"bivariate_area_chart.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"Difference Chart",
		id:9,
		src:"difference_chart.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"Stacked Area Chart",
		id:10,
		src:"stacked_area_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Streamgraph",
		id:11,
		src:"stream_graph.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Pie Chart",
		id:12,
		src:"pie_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Donut Chart",
		id:13,
		src:"donut_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},

	{
		name:"Donut Multiples",
		id:14,
		src:"donut_multiples_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Aster Plot",
		id:15,
		src:"aster_plot.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"Two Dimensional Scatter",
		id:16,
		src:"two_dimensional_scatter.js",
		min_dims:2,
		max_dims:2,
		measures:2
	},
	{
		name:"Slope Graph",
		id:17,
		src:"slopegraph.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"Cluster Dendogram",
		id:18,
		src:"cluster_dendogram.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Radial Tree",
		id:19,
		src:"radial_tree.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Bubble Chart",
		id:20,
		src:"bubble_chart.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Zoomable Circle Packing",
		id:21,
		src:"zoomable_circle_packing.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Treemap",
		id:22,
		src:"treemap.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Zoomable Tree Map",
		id:23,
		src:"zoomable_tree_map.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Zoomable Partition Layout",
		id:24,
		src:"zoomable_partition_layout.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Zoomable Sunburst",
		id:25,
		src:"zoomable_sunburst.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Collapsible Indented Tree",
		id:26,
		src:"collapsible_indented_tree.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Collapsible Force Diagram",
		id:27,
		src:"collapsible_force_diagram.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Heatmap",
		id:28,
		src:"heatmap.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Radar Chart",
		id:29,
		src:"radar_chart.js",
		min_dims:1,
		max_dims:2,
		measures:1
	},
	{
		name:"Box Plot",
		id:30,
		src:"box_plot.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Stacked Bar with Line Chart",
		id:31,
		src:"stacked_bar_with_line.js",
		min_dims:2,
		max_dims:2,
		measures:2
	}	
];


var content_options = charts.map(function(d) {
	return {
		value: d.id,
		label: d.name
	}
});

var responsive_options = [
	{
		value: false,
		label: "No"
	}, {
		value: true,
		label: "Yes"
	}];
