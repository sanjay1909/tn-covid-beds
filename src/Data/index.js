let defaultFilterParams = {
	showIcu: true,
	showO2: true,
	districtId: null
};

function filterData(data, filterParams = defaultFilterParams, searchQuery, dataFormatter){
	
	let filteredAndFormattedData = [];
	
	// 1. filter
	const {showIcu, showO2, districtId} = filterParams;
	
	if(!showIcu && !showO2){
		return filteredAndFormattedData;
	}
	
	data.map((item)=>{
		const {Name, CovidBedDetails, District} = item;
		const { VaccantICUBeds, VaccantO2Beds} = CovidBedDetails;
		
		if(showIcu && !showO2 && VaccantICUBeds == 0){ // only ICU
			return;
		}
		
		if(!showIcu && showO2 && VaccantO2Beds == 0){ // only O2
			return;
		}
		
		if(showIcu && showO2 && VaccantICUBeds == 0 && VaccantO2Beds == 0){ // both
			return;
		}
		
		if(districtId && District._id !== districtId) {
			return;
		}
		
		// 2. search
		if(searchQuery && Name.toLocaleLowerCase().search(searchQuery.toLocaleLowerCase()) < 0){
			return;
		}
		
		filteredAndFormattedData.push(dataFormatter(item))
	});
	
	return filteredAndFormattedData
}

export {
	filterData
}