import React, {useState,useRef,useEffect} from 'react';
import './style.css';

export default function Card(props) {
	const {data, showO2, showIcu} = props;
	const {location, title, vacantICUBeds, vacantO2Beds, mobile} = data;

	
	
	const locationURL = `http://maps.google.com/?q=${location[1]},${location[0]}`;
	const clickToCallUTL = `tel:+91${mobile}`;
	return (
		<div className='card'>
			<div className='card-header'>
				<div className='card-title'>
					<h4>{title}</h4>
				</div>
				<div className='card-links'>
					<a href={clickToCallUTL}><i className="fas fa-mobile-alt"></i></a>
					<a target="blank" href={locationURL}><i className="fas fa-map-marker-alt"></i></a>
				</div>
			</div>
			<div className='card-body'>
				{showIcu ? <div>ICU: <b>{vacantICUBeds}</b></div> : null}
				{showO2 ? <div>O2: <b>{vacantO2Beds}</b></div> : null}
			</div>
		</div>
	);
}