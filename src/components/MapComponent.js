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
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
      selectedMarker: undefined,
    };
  }

  onMarkerClicked = (marker) => {
    this.props.onMarkerClicked(marker);
    this.setState({ selectedMarker: marker });
  };

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
                  position={{ lat: marker.Latitude, lng: marker.Longitude }}
                  onClick={() => this.onMarkerClicked(marker)}
                />
              ))
            : null}
        </GoogleMap>
      </LoadScript>
    );
  }
}
