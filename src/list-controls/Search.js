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
	const iconClassName = searchQuery ? "fas fa-times" : "fas fa-search";
	return (
		<div className='search'>
			<input type="text"
			       value={searchQuery}
			       onChange={handleChange}
			       placeholder="Search Hospital"/>
			<i className={iconClassName} onClick={clearHandler}></i>
		</div>
	);
}