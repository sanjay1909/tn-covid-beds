import React, {useState,useRef,useEffect} from 'react';
import {getCardsData} from "./helper";
import Card from "./Card";

export default function HospitalList(props) {
	const {data, filterParams, currentLocation, sortBy, searchQuery, hoveredHospital } = props;
	
	const [cardsData, setCardsData]= useState([]);
	
	useEffect(()=>{
		if(data){
			const _data = getCardsData(data, filterParams, currentLocation, sortBy, searchQuery, hoveredHospital);
			setCardsData(_data);
		}
	},[data, filterParams.showO2, filterParams.showIcu, currentLocation,sortBy, filterParams.districtId, searchQuery, hoveredHospital]);
	
	
	const cardsUI = cardsData.map((item)=>{
		return <Card key={item.id}
		             data={item}
		             showO2={filterParams.showO2}
		             showIcu={filterParams.showIcu}/>
	});
	return (
		<div className='list-view'>
			{cardsUI}
		</div>
	);
}