import axios from "axios";
import {MAPBOX_ACCESS_TOKEN, MAPBOX_GEOCODING, TN_COVID_BEDS_DISTRICT} from "../urls";

const DISTRICTS_CACHE = {};

function getDistricts(prop){
	const cached_data = prop ? DISTRICTS_CACHE[prop] : null;
	if(cached_data){ // Check in Cache
		return new Promise((resolve)=>{
			resolve(cached_data);
		})
	}
	// Fetch and store in cache
	return axios({
		method: 'get',
		url: TN_COVID_BEDS_DISTRICT
	}).then((response)=>{
		const districtObjs = response.data.result;
		let ids = [];
		let options = [{ // all districts added as first option for drop down
			label: 'TN (All Districts)',
			value: undefined
		}];
		districtObjs.map((item)=>{
			const {Name, id} = item;
			
			ids.push(id);
			options.push({
				label: Name,
				value: id
			});
		});
		DISTRICTS_CACHE['ids'] = ids;
		DISTRICTS_CACHE['options'] = options;
		
		if(DISTRICTS_CACHE[prop]){
			return DISTRICTS_CACHE[prop];
		}
		return districtObjs;
	});
}

function forwardGeoCoding(name){
	return axios({
		method: 'get',
		url: `${MAPBOX_GEOCODING}${name},Tamil Nadu.json?types=district&access_token=${MAPBOX_ACCESS_TOKEN}`
	}).then((response)=>{
		return response.data.features[0]
	});
}

function getDistrictCoordinates(districtName){
	const cached_coordinates = DISTRICTS_CACHE[districtName];
	if(cached_coordinates){
		return new Promise((resolve)=>{
			resolve(cached_coordinates);
		});
	}
	
	return forwardGeoCoding(districtName).then((feature)=>{
		DISTRICTS_CACHE[districtName] = feature.center;
		return feature.center;
	});
}

function reverseGeoCoding(longitude, latitude){
	return axios({
		method: 'get',
		url: `${MAPBOX_GEOCODING}${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
	}).then((response)=>{
		return response.data.features[0]
	});
}
function getDistrictName(longitude, latitude){
	return reverseGeoCoding(longitude, latitude).then((feature)=>{
		// 0 - locality
		// 1 - place
		// 2 - district
		// 3 - region
		// 4 - country
		return feature.context[2].text;
	});
}

export {
	getDistricts,
	getDistrictCoordinates
}