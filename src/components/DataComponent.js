import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import NetworkContainer from "./NetworkContainer2";
import MapComponent from "./MapComponent";

import { data } from "./RI";
import { locations } from "./RI_locations";

const initialData = Object.assign({}, data);

class DataComponent extends Component {
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
      shownData: initialData,
      selectedNode: undefined,
      connectedNodes: undefined,
    };
  }

  isLinkOfNodeByID(link, nodeID) {
    return (
      ((link.source.id || link.source) === nodeID) |
      ((link.target.id || link.target) === nodeID)
    );
  }

  setNodeSelection = (d) => {
    const { selectedNode } = this.state;
    // Map over all links to get lins of this node
    const connectedIDs = new Set();
    const connectedLinks = new Set();
    data.links
      .filter((link) => this.isLinkOfNodeByID(link, d.id))
      .map((link) => {
        connectedIDs.add(link.source.id);
        connectedIDs.add(link.target.id);
        connectedLinks.add(link);
        return true;
      });
    // Map over all links again to get all ids of second degree connected nodes
    data.links
      .filter(
        (link) =>
          connectedIDs.has(link.source.id) || connectedIDs.has(link.target.id)
      )
      .map((link) => {
        connectedIDs.add(link.source.id);
        connectedIDs.add(link.target.id);
        connectedLinks.add(link);
        return true;
      });
    // Map over all nodes to get connected nodes by ID
    const connectedNodes = data.nodes.filter((node) =>
      connectedIDs.has(node.id)
    );

    this.setState({
      connectedNodes: selectedNode?.id === d.id ? null : connectedNodes,
      connectedLinks:
        selectedNode?.id === d.id ? null : Array.from(connectedLinks.values()),
      selectedNode: selectedNode?.id === d.id ? null : d,
    });
  };

  onNetworkClickNode = (d) => {
    this.setNodeSelection(d);
    return;
  };

  onMarkerClicked = (marker) => {
    const { selectedNode } = this.state;
    if (selectedNode) {
      return;
    }
    const correspondingNode = data.nodes.filter(
      (node) => node.id === marker.Nickname
    )[0];
    this.setNodeSelection(correspondingNode);
  };

  filterMarkers = () => {
    const { selectedNode } = this.state;
    let markers = locations.filter(
      (location) => location.Latitude && location.Longitude
    );
    if (!selectedNode) {
      return markers;
    }
    // TODO: put this hardcoded checks for "special" projects into the data pipeline
    if (selectedNode.id.includes("AT:")) {
      return markers.filter((marker) => marker.Nickname === "Aves Terrestres");
    }
    // TODO: put this hardcoded checks for "special" projects into the data pipeline
    if (selectedNode.id.includes("GV:")) {
      return markers.filter((marker) => marker.Nickname === "Galapagos Verde");
    }
    return markers.filter((marker) => marker.Nickname === selectedNode.id);
  };

  render() {
    const { shownData, selectedNode, connectedNodes, connectedLinks } =
      this.state;
    const markers = this.filterMarkers();
    return (
      <Grid container>
        <Grid item className="grid-item" xs={6}>
          <NetworkContainer
            data={shownData}
            selectedNode={selectedNode}
            connectedNodes={connectedNodes}
            connectedLinks={connectedLinks}
            onNodeClicked={(d, cb) => this.onNetworkClickNode(d, cb)}
          />
        </Grid>
        <Grid item className="grid-item" xs={6}>
          <MapComponent
            markers={markers}
            onMarkerClicked={(m, cb) => this.onMarkerClicked(m, cb)}
          />
        </Grid>
      </Grid>
    );
  }
};

export default DataComponent;
