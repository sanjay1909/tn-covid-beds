import React, {useState,useRef,useEffect} from 'react';
import '../HospitalList/style.css';

export default function Search(props) {
	const { onChange, searchQuery} = props;
	
	const handleChange = event => {
		onChange && typeof onChange == 'function' && onChange(event.target.value)
	};
	
	function clearHandler(){
		onChange && typeof onChange == 'function' && onChange('')
	}
	
	return (
		<div className='search'>
			<input type="text"
			       value={searchQuery}
			       onChange={handleChange}
			       placeholder="Search"/>
			{searchQuery ? <i className="fas fa-times" onClick={clearHandler}></i> : null }
		</div>
	);
}