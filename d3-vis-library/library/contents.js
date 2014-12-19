var charts = [
	{
		name:"Bar Chart",
		id:1,
		src:"bar_chart.js"
	},
	{
		name:"Area Chart",
		id:2,
		src:"area_chart.js"
	}
];


var content_options = charts.map(function(d) {
	return {
		value: d.id,
		label: d.name
	}
});