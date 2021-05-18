import {filterData} from '../Data';

//https://stackoverflow.com/questions/26836146/how-to-sort-array-items-by-longitude-latitude-distance-in-javascripts

function calculateDistance(lat1, lon1, lat2, lon2, unit = 'K') {
	let radlat1 = Math.PI * lat1/180
	let radlat2 = Math.PI * lat2/180
	let radlon1 = Math.PI * lon1/180
	let radlon2 = Math.PI * lon2/180
	let theta = lon1-lon2
	let radtheta = Math.PI * theta/180
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

function compare( a, b, prop , isAsc = true) {
	if ( a[prop] < b[prop] ){
		return isAsc ? -1 : 1;
	}
	if ( a[prop] > b[prop] ){
		return isAsc ? 1: -1;
	}
	return 0;
}

function formatAsCardData(item, currentLocation){
	const {Latitude, Longitude, Name, CovidBedDetails, _id, MobileNumber} = item;
	const {VaccantICUBeds,VaccantO2Beds} = CovidBedDetails;
	
	const distance = currentLocation ? calculateDistance(Latitude,Longitude, currentLocation[0], currentLocation[1]) : null;
	return {
		'location': [Longitude, Latitude ],
		'title': Name,
		'id': _id,
		'mobile': MobileNumber,
		'vacantICUBeds': VaccantICUBeds,
		'vacantO2Beds': VaccantO2Beds,
		'distance':distance,
	};
}

// sortBy: vacantICUBeds,  vacantO2Beds, distance
function getCardsData(array, filterParams, currentLocation, sortBy = 'vacantICUBeds', searchQuery, hoveredHospital){
	const {showIcu, showO2, districtId} = filterParams;
	let sortByValue = sortBy ? sortBy : ( showIcu ? 'vacantICUBeds' : (showO2 ? 'vacantO2Beds': undefined) );
	
	const searchValue = hoveredHospital ? hoveredHospital : searchQuery;

	const cards = filterData(array, filterParams, searchValue, (item)=>{
		return formatAsCardData(item, currentLocation)
	});
	
	const sortedArray = sortByValue ? cards.sort((a, b)=>{
		let isAsc = sortByValue == 'distance';
		
		return compare(a,b , sortByValue, isAsc)
	}) : cards;
	
	return sortedArray;
	
}

export {
	getCardsData
}