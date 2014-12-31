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
		name:"Area Chart",
		id:2,
		src:"area_chart.js",
		min_dims:1,
		max_dims:1,
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
		name:"Grouped Bar Chart",
		id:5,
		src:"grouped_bar_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Treemap",
		id:6,
		src:"treemap.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Cluster Dendogram",
		id:7,
		src:"cluster_dendogram.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Radial Tree",
		id:8,
		src:"radial_tree.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Zoomable Circle Packing",
		id:9,
		src:"zoomable_circle_packing.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Collapsible Force Diagram",
		id:10,
		src:"collapsible_force_diagram.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Zoomable Partition Layout",
		id:11,
		src:"zoomable_partition_layout.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Collapsible Indented Tree",
		id:12,
		src:"collapsible_indented_tree.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Line Chart",
		id:13,
		src:"line_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Multi-Series Line Chart",
		id:14,
		src:"multi_series_line_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Bivariate Area Chart",
		id:15,
		src:"bivariate_area_chart.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"Stacked Area Chart",
		id:16,
		src:"stacked_area_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Donut Chart",
		id:17,
		src:"donut_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Pie Chart",
		id:18,
		src:"pie_chart.js",
		min_dims:1,
		max_dims:1,
		measures:1
	},
	{
		name:"Donut Multiples",
		id:19,
		src:"donut_multiples_chart.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Two Dimensional Scatter",
		id:20,
		src:"two_dimensional_scatter.js",
		min_dims:2,
		max_dims:2,
		measures:2
	},
	{
		name:"Box Plot",
		id:21,
		src:"box_plot.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Bubble Chart",
		id:22,
		src:"bubble_chart.js",
		min_dims:2,
		max_dims:1000,
		measures:1
	},
	{
		name:"Streamgraph",
		id:23,
		src:"stream_graph.js",
		min_dims:2,
		max_dims:2,
		measures:1
	},
	{
		name:"Difference Chart",
		id:24,
		src:"difference_chart.js",
		min_dims:1,
		max_dims:1,
		measures:2
	},
	{
		name:"Aster Plot",
		id:25,
		src:"aster_plot.js",
		min_dims:1,
		max_dims:1,
		measures:2
	}
];


var content_options = charts.map(function(d) {
	return {
		value: d.id,
		label: d.name
	}
});