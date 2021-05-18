import axios from "axios";

const ACCESS_TOKEN = 'pk.eyJ1Ijoic2FuamF5MTkwOSIsImEiOiJja29ueGplaWcwNTF4MnBtcHYycXR2cm5tIn0.nMzNmf0lrqBXwxe6Sx7R8w';

const sortValues = ['Availability','O2 Bed Availability','ICU Availability','Normal Bed Availability'];

function getTamilNaduHospitalsCount(){
	return getDistrictIds().then((districtIds)=>{
		const payload = {
			"searchString":"",
			"sortCondition":{"Name":1},
			"pageNumber":1,
			"pageLimit":10,
			"SortValue":"Availability",
			"Districts":districtIds,
			"BrowserId":"2d63d3c86f896d124ca7b0a26404ed64",
			"IsGovernmentHospital":true,
			"IsPrivateHospital":true,
			"FacilityTypes":["CHO","CHC","CCC"]
		};
		return axios({
			method: 'post',
			url: 'https://tncovidbeds.tnega.org/api/hospitals',
			data: payload
		}).then((response)=>{
			const data = response.data;
			const {pagination} = data;
			const {totalCount} = pagination;
			return {
				districtIds: districtIds,
				hospitalCount: totalCount + 1
			};
		});
	})
}

function getAllTamilNaduHospitals(){
	return getTamilNaduHospitalsCount().then((data)=>{
		const {districtIds,hospitalCount } = data;
		
		const payload = {
			"searchString":"",
			"sortCondition":{"Name":1},
			"pageNumber":1,
			"pageLimit":hospitalCount,
			"SortValue":"Availability",
			"Districts":districtIds,
			"BrowserId":"2d63d3c86f896d124ca7b0a26404ed64",
			"IsGovernmentHospital":true,
			"IsPrivateHospital":true,
			"FacilityTypes":["CHO","CHC","CCC"]
		};
		
		return axios({
			method: 'post',
			url: 'https://tncovidbeds.tnega.org/api/hospitals',
			data: payload
		}).then((res)=>{
			return res.data.result
		})
	})
}

function getDistricts(){
	return axios({
		method: 'get',
		url: 'https://tncovidbeds.tnega.org/api/district'
	}).then((response)=>{
		return response.data.result
	});
}

function getDistrictIds(){
	return axios({
		method: 'get',
		url: 'https://tncovidbeds.tnega.org/api/district'
	}).then((response)=>{
		const data =  response.data.result;
		return data.map((item)=>{
			return item.id
		});
	});
}

function reverseGeoCoding(longitude, latitude){
	return axios({
		method: 'get',
		url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${ACCESS_TOKEN}`
	}).then((response)=>{
		return response.data.features[0]
	});
}

function forwardGeoCoding(name){
	return axios({
		method: 'get',
		url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=${ACCESS_TOKEN}`
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

function getDistrictCoords(DistrictName){
	return forwardGeoCoding(DistrictName).then((feature)=>{
		return feature.center;
	});
}

function getDistrictId(longitude, latitude){
	return getDistrictName(longitude, latitude).then((name)=>{
		return getDistricts().then((data)=>{
			let districtId;
			data.map((item)=>{
				if(item.Name.toLocaleLowerCase() == name.toLocaleLowerCase() ){
					districtId = item.id;
				}
			});
			return districtId
		});
	});
}

function getDistrictOptions(){
	return axios({
		method: 'get',
		url: 'https://tncovidbeds.tnega.org/api/district'
	}).then((response)=>{
		const data =  response.data.result;
		let options = [
			{
				label: 'TN (All Districts)',
				value:  undefined
			}
		]
		 data.map((item)=>{
			 options.push( {
				label: item.Name,
				value: item.id
			})
		});
		return options;
	});
}
export {
	getDistrictCoords,
	getDistrictId,
	getAllTamilNaduHospitals,
	getDistrictOptions
}