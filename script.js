const margin = { t: 50, r: 50, b: 50, l: 50 };
const size = { w: 800, h: 800 };
const svg = d3.select("svg");

svg.attr("width", size.w).attr("height", size.h);

// d3.json('data/maps/us-counties.geo.json')
//     .then(function (mapData) {

// });

Promise.all([
	d3.json("data/maps/us-counties.geo.json"),
	d3.csv("data/mort-refined.csv"),
]).then(function (datasets) {
	console.log(datasets);
	const mapData = datasets[0];
	const mortalityData = datasets[1];
	let mapG = svg.append("g").classed("map", true);
	drawMap(mapG, mapData, mortalityData);
});

function drawMap(mapG, mapData, mortalityData) {
	let projection = d3.geoMercator().fitSize([size.w, size.h], mapData);
	let path = d3.geoPath(projection);

	let pathSel = mapG
		.selectAll("path")
		.data(mapData.features)
		.enter()
		.append("path")
		.attr("state", function (d) {
			return d.properties.STATE;
		})
		.attr("county", function (d) {
			return d.properties.COUNTY;
		})
		.attr("d", function (d) {
			return path(d);
		});
}
