import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import SearchBox from './SearchBox';
import Marker from './Marker';

// This is my own Google Maps API key, would be good to change it to yours API key once created.
const API_KEY = 'AIzaSyA8npv0UHbvFAnvAO3FeMgbLXh4u_5trS8';

// For this example Malaga will be the default map location.
const malagaCoordenates = {lat: 36.7213189, lng: -4.421437200000014}
class SharedMap extends Component {

  getCoordenates = (mapEvent) => {
    const {lat, lng} = mapEvent;
    this.props.emitLocation(lat, lng)
  }

  changeCurrentPlace = (coordenates) => {
    console.log("new place", coordenates)
  }

  render() {
    const { newLocation, chargers} = this.props;
    const {chargerLatitude, chargerLongitude} = newLocation;

    const chargersMarkers = chargers.map((chargerData, index) =>
      <Marker
        hover={true}
        name={chargerData.chargerName}
        status={chargerData.chargerStatus}
        lat={chargerData.latitude}
        lng={chargerData.longitude}
        key={index}
      />
    )
    return (
      <div style={{ marginTop:20, padding: "10px 20px 0px 20px", height: '600px', width: '100%', maxWidth: "980px", position: "relative" }}>
        <SearchBox style={{zIndex: 100, fontSize: "1.2rem", height: 40, width: 260, position: "absolute", top: 20, left: 20}} onPlacesChanged={this.changeCurrentPlace}/>
        <GoogleMap
          bootstrapURLKeys={{
            key: API_KEY,
          }}
          onClick={this.getCoordenates}
          defaultZoom={13}
          defaultCenter={malagaCoordenates}
        >
          {
            chargerLatitude !== "" &&
            chargerLongitude !== "" &&
            <Marker
              hover={false}
              status="new"
              lat={chargerLatitude}
              lng={chargerLongitude}
            />
          }
          {chargersMarkers}
        </GoogleMap>
      </div>
    )
  }
}

export default SharedMap;