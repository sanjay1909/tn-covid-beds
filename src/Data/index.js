
function compare( a, b, prop , isAsc = true) {
	if ( a[prop] < b[prop] ){
		return isAsc ? -1 : 1;
	}
	if ( a[prop] > b[prop] ){
		return isAsc ? 1: -1;
	}
	return 0;
}

let defaultFilterParams = {
	showIcu: true,
	showO2: true,
	districtId: null
};

let defaultSortParams = {
	prop: null,
	isAsc: true
};

function defaultGetter(item){
	const {Name, CovidBedDetails, District} = item;
	const { VaccantICUBeds, VaccantO2Beds} = CovidBedDetails;
	return {
		hospitalName:Name,
		icuBeds:VaccantICUBeds,
		o2Beds:VaccantO2Beds,
		districtID:District._id
	}
}

function filterData(data, filterParams = defaultFilterParams, searchQuery, sortParams = defaultSortParams, dataFormatter , getter = defaultGetter){
	
	let filteredAndFormattedData = [];
	
	// 1. filter
	const {showIcu, showO2, districtId} = filterParams;
	
	if(!showIcu && !showO2){
		return filteredAndFormattedData;
	}
	
	data.map((item , index)=>{
		if(index == 0){
			console.log(item);
		}
		const dataForFilter = getter(item);
		const {hospitalName, icuBeds, o2Beds, districtID } = dataForFilter;
		
		if(showIcu && !showO2 && icuBeds == 0){ // only ICU
			return;
		}
		
		if(!showIcu && showO2 && o2Beds == 0){ // only O2
			return;
		}
		
		if(showIcu && showO2 && icuBeds == 0 && o2Beds == 0){ // both
			return;
		}
		
		if(districtId && districtID !== districtId) {
			return;
		}
		
		// 2. search
		if(searchQuery && hospitalName.toLocaleLowerCase().search(searchQuery.toLocaleLowerCase()) < 0){
			return;
		}
		
		filteredAndFormattedData.push(dataFormatter(item))
	});
	
	const sortedArray = sortParams.prop ? filteredAndFormattedData.sort((a, b)=>{
		const {prop, isAsc} = sortParams;
		return compare(a,b , prop, isAsc)
	}) : filteredAndFormattedData;
	
	return sortedArray
}

export {
	filterData
}