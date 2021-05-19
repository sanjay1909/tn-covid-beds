import {getDistricts} from "../districts";
import axios from "axios";
import {TN_COVID_BEDS_HOSPITALS} from "../urls";

const sortValues = ['Availability','O2 Bed Availability','ICU Availability','Normal Bed Availability'];

const defaultPayload =  {
	"searchString":"",
	"sortCondition":{"Name":1},
	"pageNumber":1,
	"pageLimit":10,
	"SortValue":"Availability",
	"BrowserId":"2d63d3c86f896d124ca7b0a26404ed64",
	"IsGovernmentHospital":true,
	"IsPrivateHospital":true,
	"FacilityTypes":["CHO","CHC","CCC"]
};

function getTamilNaduHospitalsCount(){
	return getDistricts('ids').then((districtIds)=>{
		const payload = Object.assign({}, defaultPayload,{"Districts":districtIds});
		return axios({
			method: 'post',
			url: TN_COVID_BEDS_HOSPITALS,
			data: payload
		}).then((response)=>{
			const {data} = response;
			const {pagination} = data;
			const {totalCount} = pagination;
			return {
				districtIds: districtIds,
				hospitalCount: totalCount + 1
			};
		});
	});
}

function getAllTamilNaduHospitals(){
	return getTamilNaduHospitalsCount().then((countObj)=>{
		const {districtIds,hospitalCount } = countObj;
		
		const payload = Object.assign({}, defaultPayload,{
			"pageLimit":hospitalCount,
			"Districts":districtIds
		});
		return axios({
			method: 'post',
			url: TN_COVID_BEDS_HOSPITALS,
			data: payload
		}).then((response)=>{
			return response.data.result
		})
	});
}

export {
	getAllTamilNaduHospitals
}