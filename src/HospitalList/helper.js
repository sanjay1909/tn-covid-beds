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
function formatAsCardData(item, currentLocation){
	const {Latitude, Longitude, Name, CovidBedDetails, _id, MobileNumber, BedDetailProcessedDate} = item;
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
		'lastUpdated': getSemanticDateDiff(BedDetailProcessedDate)
	};
}

function JSClock(epochTime) {
	const time = new Date(epochTime * 1000);
	const hour = time.getHours();
	const minute = time.getMinutes();
	const second = time.getSeconds();
	let temp = '' + ((hour > 12) ? hour - 12 : hour);
	if (hour == 0)
		temp = '12';
	temp += ((minute < 10) ? ':0' : ':') + minute;
	temp += ((second < 10) ? ':0' : ':') + second;
	temp += (hour >= 12) ? ' P.M.' : ' A.M.';
	return temp;
}

// sortBy: vacantICUBeds,  vacantO2Beds, distance
function getCardsData(array, filterParams, currentLocation, sortBy = 'vacantICUBeds', searchQuery, hoveredHospital){
	const {showIcu, showO2, districtId} = filterParams;
	
	let sortByValue = sortBy ? sortBy : ( showIcu ? 'vacantICUBeds' : (showO2 ? 'vacantO2Beds': undefined) );
	const sortParams = {
		prop: sortByValue,
		isAsc: sortByValue == 'distance'
	};
	
	const searchValue = hoveredHospital ? hoveredHospital : searchQuery;
	
	const cards = filterData(array, filterParams, searchValue, sortParams,(item)=>{
		return formatAsCardData(item, currentLocation)
	});
	
	return cards;
}

export {
	getCardsData
}