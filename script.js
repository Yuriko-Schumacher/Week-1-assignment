const margin = { t: 50, r: 50, b: 50, l: 50 };
const size = { w: 800, h: 550 };
const svg = d3.select("#map").append("svg");

svg.attr("width", size.w).attr("height", size.h);

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
	let projection = d3.geoAlbersUsa().fitSize([size.w, size.h], mapData);
	let path = d3.geoPath(projection);

	let pathSel = mapG
		.selectAll("path")
		.data(mapData.features)
		.enter()
		.append("path")
		.attr("state", (d) => {
			return d.properties.STATE;
		})
		.attr("county", (d) => {
			return d.properties.COUNTY;
		})
		.attr("d", (d) => {
			return path(d);
		});

	let extent = d3.extent(mortalityData, (d) => +d.mortalityRate).reverse();
	console.log(extent);

	let colorScale = d3
		.scaleSequential()
		.domain(extent)
		.interpolator(d3.interpolateRdYlBu);

	pathSel.style("fill", (d) => {
		let stateCode = +d.properties.STATE;
		let countyCode = +d.properties.COUNTY;
		let county = mortalityData.filter(
			(el) => +el.state === stateCode && +el.county === countyCode
		);
		if (county.length > 0) {
			county = county[0];
			return colorScale(+county.mortalityRate);
		}
		return "#aaa";
	});
}
