import React, {useState,useRef,useEffect} from 'react';
import Switch from "react-switch";
import './style.css';
import Select from 'react-select';
import 'react-dropdown/style.css';


export default function MapControls(props) {
	const {enableIcu, onIcuChange, enableO2, onO2Change,
		district, districtOptions, onDistrictChange} = props;
	
	function handleIcuChange(){
		onIcuChange && typeof onIcuChange == 'function' && onIcuChange(!enableIcu)
	}
	
	function handleO2Change(){
		onO2Change && typeof onO2Change == 'function' && onO2Change(!enableO2)
	}
	
	return (
		<div className='map-controls-container'>
			<div className='map-controls'>
				<div className='district-select'>
					<Select options={districtOptions}
					        onChange={onDistrictChange}
					        value={district}
					        placeholder="Districts"/>
				</div>
				<label htmlFor="icu-switch">
					<span>ICU</span>
					<Switch
						checked={enableIcu}
						onChange={handleIcuChange}
						onColor="#54e950"
						onHandleColor="#139c0f"
						handleDiameter={30}
						uncheckedIcon={false}
						checkedIcon={false}
						boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
						activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
						height={20}
						width={48}
						className="react-switch"
						id="icu-switch"
					/>
				</label>
				<label htmlFor="o2-switch">
					<span>O2</span>
					<Switch
						checked={enableO2}
						onChange={handleO2Change}
						onColor="#f8bd82"
						onHandleColor="#FF8409"
						handleDiameter={30}
						uncheckedIcon={false}
						checkedIcon={false}
						boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
						activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
						height={20}
						width={48}
						className="react-switch"
						id="o2-switch"
					/>
				</label>
			
				
			</div>
		</div>
		
	)
}