import React, {useState,useRef,useEffect} from 'react';
import Search from "./Search";
import Select from "react-select";
import './style.css'

export default function ListControls(props) {
	const { onSearch, sortBy, sortOptions, onSort, searchQuery} = props
	
	return (
		<div className='list-controls-container'>
			<div className='list-controls'>
				<div className='sort-select'>
					
					<div className='select'>
						<Select options={sortOptions}
						        onChange={onSort}
						        value={sortBy}
						        placeholder="Sort By" />
					</div>
					<label>Sort By</label>
				</div>
				<Search searchQuery={searchQuery}
				        onChange={onSearch}/>
			</div>
		</div>
	);
}