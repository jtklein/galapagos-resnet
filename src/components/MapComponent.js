import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const DEV_KEY = process.env.GOOGLE_MAPS_DEV_KEY;
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 0.14, lng: -90.75 };
const zoom = 7.6;

export default class MyComponents extends Component {
  render() {
    return (
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
        >
          {/* Child components, such as markers, info windows, etc. */}
          {this.props.markers
            ? this.props.markers.map((marker, index) => (
                <Marker
                  key={`marker_${index}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => this.props.onMarkerClicked(marker)}
                />
              ))
            : null}
        </GoogleMap>
      </LoadScript>
    );
  }
}
