import {filterData} from '../Data';

function getSemanticDateDiff(epochTime){
	const date = new Date(epochTime * 1000);
	const currentDate = new Date();
	const differenceInTime = currentDate.getTime() - date.getTime();
	const differenceInMIn = differenceInTime / (1000 * 3600 );
	const days = Math.floor(differenceInMIn / 24);
	const mins =  Math.floor(differenceInMIn % 24);
	if(days == 0){
		return `${mins} Mins`
	}
	return `${days} Days ${mins} Mins`
}

function formatAsGeoJsonData(item){
	const {Latitude, Longitude, Name, CovidBedDetails,BedDetailProcessedDate} = item;
	const {VaccantICUBeds,VaccantO2Beds} = CovidBedDetails;
	
	return {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [Longitude, Latitude ]
		},
		"properties": {
			'title': Name,
			'vacantICUBeds': VaccantICUBeds,
			'vacantO2Beds': VaccantO2Beds,
			'lastUpdated': getSemanticDateDiff(BedDetailProcessedDate)
		}
	};
}

function arrayToGeoJson(array, filterQuery, districtId, onlyData = false, searchQuery){
	const filterParams = {
		showIcu: filterQuery == 'icu' ||  filterQuery == 'both',
		showO2: filterQuery == 'o2' ||  filterQuery == 'both',
		districtId,
	};
	
	const features = filterData(array, filterParams, searchQuery, undefined,formatAsGeoJsonData);
	
	const data = {
		'type': 'FeatureCollection',
		'features': features
	};
	if(onlyData){
		return data
	}
	return {
		"type":"geojson",
		"data":data
	};
}

function renderPopup(properties){
	const {title, vacantICUBeds, vacantO2Beds, lastUpdated} = properties;
	return `
		<div>
			<strong>${title}</strong>
			<div>
				<table>
					<tbody>
					<tr>
						<td style="color:#818181;">ICU Beds: </td>
						<td style="font-size: 13px;"><b>${vacantICUBeds}</b></td>
					
					</tr>
					<tr>
						<td style="color:#818181;">O2 Beds: </td>
						<td style="font-size: 13px;"><b>${vacantO2Beds}</b></td>
					</tr>
					</tbody>
				</table>
				<div>
					<span style="color:grey;">Last update:</span><b> ${lastUpdated} </b> <span style="color:grey;">ago</span>
				</div>
</div>
		</div>
		</div>
	`
}

function createLayerFor(layerName, data, map, popup, onClickCallback) {
	function mouseEnter(e){
		// Change the cursor style as a UI indicator.
		map.getCanvas().style.cursor = 'pointer';
		
		const coordinates = e.features[0].geometry.coordinates.slice();
		const properties = e.features[0].properties;
		
		const description = renderPopup(properties);
		
		// Ensure that if the map is zoomed out such that multiple
		// copies of the feature are visible, the popup appears
		// over the copy being pointed to.
		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}
		
		// Populate the popup and set its coordinates
		// based on the feature found.
		popup.setLngLat(coordinates).setHTML(description).addTo(map);
	}
	function mouseLeave(e){
		map.getCanvas().style.cursor = '';
		popup.remove();
	}
	function mouseClick(e){
		const properties = e.features[0].properties;
		
		const {title} = properties;
		onClickCallback && onClickCallback({
			query: title,
			initiator: 'map'
		})
	}
	
	const geoJsonDataICU = arrayToGeoJson(data, layerName);
	map.addSource(layerName, geoJsonDataICU);
	map.addLayer({
		'id': layerName,
		'type': 'circle',
		'source': layerName,
		paint : {
			'circle-color': layerName == 'icu' ? '#139c0f' : '#FF8409',
			'circle-radius': 10,
			'circle-stroke-width': 2,
			'circle-stroke-color': '#ffffff'
		},
		'layout': {
			'visibility': 'visible'
		}
		/*'layout': {
			'text-field': ['get', 'title'], // get the title name from the source's "title" property
			'text-font': ['Open Sans Semibold','Arial Unicode MS Bold'],
			'text-offset': [0, 1.25],
			'text-anchor': 'top'
		}*/
	});
	map.on('mouseenter', layerName, mouseEnter);
	map.on('mouseleave', layerName, mouseLeave);
	map.on('click', layerName, mouseClick);
}

function filterMapData(data, layerName, districtId, searchQuery){
	return arrayToGeoJson(data, layerName, districtId, true, searchQuery);
}



export {
	createLayerFor,
	filterMapData,
}