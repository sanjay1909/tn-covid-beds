import React, {useState,useRef,useEffect} from 'react';
import './style.css';

export default function Card(props) {
	const {data, showO2, showIcu} = props;
	const {location, title, vacantICUBeds, vacantO2Beds, mobile, lastUpdated} = data;

	
	
	const locationURL = `http://maps.google.com/?q=${location[1]},${location[0]}`;
	const clickToCallUTL = `tel:+91${mobile}`;
	const icuStatusStyle = vacantICUBeds == 0 ? {color: 'grey'} : null;
	const o2StatusStyle = vacantO2Beds == 0 ? {color: 'grey'} : null;
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
				<div className='bed-status'>
					{showIcu ?  <div>
												<label style={icuStatusStyle}>ICU</label>
												<span style={icuStatusStyle}><b>{vacantICUBeds}</b></span>
											</div> : null}
					{showO2 ?   <div>
												<label style={o2StatusStyle}>O2</label>
												<span style={o2StatusStyle}><b>{vacantO2Beds}</b></span>
											</div> : null}
				</div>
				<div className='updated-time'>
					<span>Last Updated </span>{lastUpdated} {lastUpdated == 'Now' ? '' : <span>ago</span>}
				</div>
			</div>
		</div>
	);
}