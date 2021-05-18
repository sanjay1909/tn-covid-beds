import React, {useState,useRef,useEffect} from 'react';
import Map from './map';
import HospitalList from './HospitalList';
import MapControls from './map-controls';
import ListControls from './list-controls';
import {getDistrictOptions, getAllTamilNaduHospitals} from './service';
import './app.css'

const options = [
	{ value: 'vacantICUBeds', label: 'ICU Beds' },
	{ value: 'vacantO2Beds', label: 'O2 Beds' }
];


export default function App() {
	const [currentLocation, setCurrentLocation] = useState(null);
	
	const [districtOptions, setDistrictOptions] = useState(null);
	const [district, setDistrict] = useState(null);
	
	const [showIcu, setShowIcu] = useState(true);
	const [showO2, setShowO2] = useState(true);
	const [sortBy, setSortBy] = useState(options[1]);
	
	const [searchQuery, setSearchQuery] = useState();
	const searchInitiatorRef = useRef(null);
	
	const [nearbyHospitals, setNearbyHospitals] = useState();
	
	useEffect(() => {
		getDistrictOptions().then((options)=>{
			setDistrictOptions(options)
			setDistrict(options[0]);
		});
		
	}, []);
	
	useEffect(() => {
		getAllTamilNaduHospitals().then((hospitals)=>{
			setNearbyHospitals(hospitals)
		});
	}, []);
	
	function onDistrictChangeHandler(option){
		setDistrict(option);
	}
	
	function currentLocationLoadedHandler(longitude, latitude){
		setCurrentLocation([latitude, longitude])
		options[2] = { value: 'distance', label: 'Distance' };
		setSortBy(options[2]);
	}
	
	
	const filterParams = {
		showO2,
		showIcu,
		districtId: district ? district.value : null
	};
	
	function mapPointClickHandler(data){
		searchInitiatorRef.current = data.initiator;
		setSearchQuery(data.query);
	}
	
	function listItemClickHandler(data){
		searchInitiatorRef.current = data.initiator;
		setSearchQuery(data.query);
		
	}
	
	function listSearchHandler(query){
		searchInitiatorRef.current = null;
		setSearchQuery(query);
		
	}
	
	const mapSearchQuery = searchInitiatorRef.current == 'map' ? '' : searchQuery;
	const listSearchQuery = searchInitiatorRef.current == 'list' ? '' : searchQuery;
	
	return (
		<div className='app'>
			<MapControls enableO2={showO2}
			          district={district}
			          districtOptions={districtOptions}
			          onDistrictChange={onDistrictChangeHandler}
			          onO2Change={setShowO2}
			          onIcuChange={setShowIcu}
			          enableIcu={showIcu}/>
			<Map onCurrentLocation={currentLocationLoadedHandler}
			     currentLocation={currentLocation}
			     filterParams={filterParams}
			     searchQuery={mapSearchQuery}
			     districtName={district ? district.label : null}
			     onClick={mapPointClickHandler}
			     mapData={nearbyHospitals}/>
      <ListControls sortBy={sortBy}
                    sortOptions={options}
                    onSort={setSortBy}
                    searchQuery={listSearchQuery}
                    onSearch={listSearchHandler}/>
			<HospitalList filterParams={filterParams}
			              searchQuery={searchQuery}
			              onClick={listItemClickHandler}
			              sortBy={ sortBy ? sortBy.value: undefined }
			              currentLocation={currentLocation}
			              data={nearbyHospitals}/>
			
		</div>
		
	);
}