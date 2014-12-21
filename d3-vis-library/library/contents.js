var charts = [
	{
		name:"Bar Chart",
		id:1,
		src:"bar_chart.js",
		dims:1,
		measures:1
	},
	{
		name:"Area Chart",
		id:2,
		src:"area_chart.js",
		dims:1,
		measures:1
	},
	{
		name:"Stacked Bar Chart",
		id:3,
		src:"stacked_bar_chart.js",
		dims:2,
		measures:1
	},
	{
		name:"Normalized Stacked Bar Chart",
		id:4,
		src:"normalized_stacked_bar_chart.js",
		dims:2,
		measures:1
	}
];


var content_options = charts.map(function(d) {
	return {
		value: d.id,
		label: d.name
	}
});