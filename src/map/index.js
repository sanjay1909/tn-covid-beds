import React, {useState,useRef,useEffect} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import {createLayerFor, filterMapData} from './helper'; // eslint-disable-line import/no-webpack-loader-syntax
import {getDistrictCoords} from '../service'; // eslint-disable-line import/no-webpack-loader-syntax
import './style.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuamF5MTkwOSIsImEiOiJja29ueGplaWcwNTF4MnBtcHYycXR2cm5tIn0.nMzNmf0lrqBXwxe6Sx7R8w';

export default function Map(props) {
	const {mapData, filterParams, longitude = 80.2707, latitude = 13.0827, onCurrentLocation, districtName, searchQuery, onClick} = props;
	
	const mapContainer = useRef(null);
	
	const mapRef = useRef(null);
	const geoLocateRef = useRef(null);
	const popupRef = useRef(null);
	// default chennai
	const [lng, setLng] = useState(longitude);
	const [lat, setLat] = useState(latitude);
	const [zoom, setZoom] = useState(8);
	const [loaded, setLoaded] = useState(false);
	
	useEffect(() =>{
		const map = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});
		
		// Add geolocate control to the map.
		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			fitBoundsOptions: {
				maxZoom: 11
			},
			trackUserLocation: true
		});
		map.addControl(geolocate);
		geolocate.on('geolocate', function(e) {
			const coords = e.coords
			const {longitude, latitude} = coords;
			setLng(longitude);
			setLat(latitude);
			onCurrentLocation && typeof onCurrentLocation == 'function' && onCurrentLocation(longitude,latitude)
			
			map.on('move', () => {
				setLng(map.getCenter().lng.toFixed(4));
				setLat(map.getCenter().lat.toFixed(4));
				setZoom(map.getZoom().toFixed(2));
			});
		});
		
		// Create a popup, but don't add it to the map yet.
		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});
		
		map.once('load', () => {
			setLoaded(true);
		});
		
		
		mapRef.current = map;
		geoLocateRef.current = geolocate;
		popupRef.current = popup;
		
		return ()=>{
			map.remove();
			mapRef.current = null;
			geoLocateRef.current = null;
			popupRef.current = null;
		}
		
	}, []);
	
	useEffect(()=>{
		if(loaded){
			const geoLocate = geoLocateRef.current;
			geoLocate.trigger();
		}
		
	}, [loaded]);
	
	useEffect(()=>{
		if(mapData){
			const map = mapRef.current;
			const popup = popupRef.current;
			createLayerFor('icu', mapData, map, popup, onClick);
			createLayerFor('o2', mapData, map, popup, onClick);
		}
	}, [ mapData]);
	
	useEffect(()=>{
		if(mapData){
			const map = mapRef.current;
			const visibilityValue = filterParams.showIcu ? 'visible' : 'none';
			map.setLayoutProperty(
				'icu',
				'visibility',
				visibilityValue
			);
			
		}
	}, [ mapData, filterParams.showIcu]);
	
	useEffect(()=>{
		if(mapData){
			const map = mapRef.current;
			const visibilityValue = filterParams.showO2 ? 'visible' : 'none';
			map.setLayoutProperty(
				'o2',
				'visibility',
				visibilityValue
			);
			
		}
	}, [ mapData, filterParams.showO2]);
	
	useEffect(()=>{
		if(mapData){
			const map = mapRef.current;
			let data;
			if(filterParams.showIcu ){
				data = filterMapData(mapData, 'icu', filterParams.districtId, searchQuery)
				map.getSource('icu').setData(data);
			}
			
			if(filterParams.showO2) {
				data = filterMapData(mapData, 'o2',filterParams. districtId, searchQuery);
				map.getSource('o2').setData(data);
			}
			
		}
	}, [mapData, filterParams.districtId, filterParams.showIcu, filterParams.showO2, searchQuery]);
	
	useEffect(()=>{
		if(mapData ){
			const map = mapRef.current;
			if(filterParams.districtId && districtName){
				getDistrictCoords(districtName).then((districtCoord)=>{
					map.flyTo({
// These options control the ending camera position: centered at
// the target, at zoom level 9, and north up.
						center: districtCoord ,
						zoom: 9,
						bearing: 0,

// These options control the flight curve, making it move
// slowly and zoom out almost completely before starting
// to pan.
						speed: 2, // make the flying slow
						curve: 1, // change the speed at which it zooms out

// This can be any easing function: it takes a number between
// 0 and 1 and returns another number between 0 and 1.
						easing: function (t) {
							return t;
						},

// this animation is considered essential with respect to prefers-reduced-motion
						essential: true
					});
				});
			}
			
		}
	}, [mapData, districtName, filterParams.districtId])
	
	
	
	
	return (
		<div ref={mapContainer} className="map-container" />
	);
}