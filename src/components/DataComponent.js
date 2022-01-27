import React, { Component } from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";

import NetworkContainer from "./NetworkContainer2";
import MapComponent from "./MapComponent";
import { data } from "./RI";

const initialData = Object.assign({}, data);

const testCoordinates = {
  0: {
    title:
      "Estudio del estado de las poblacion de pinguino, cormoran no volador y albatros de Galápagos",
    "Lead researcher": "Gustavo Jimenez",
    locations: [
      {
        Island: "Fernandina",
        Site: "Punta Espinoza",
        lat: -0.262757801,
        lng: -91.44395571,
      },
      {
        Island: "Isabela",
        Site: "Marielas",
        lat: -0.594764945,
        lng: -91.09091762,
      },
      {
        Island: "Isabela",
        Site: "Punta Albemarle",
        lat: 0.163234486,
        lng: -91.34252459,
      },
      {
        Island: "Española",
        Site: "Punta Suarez",
        lat: -1.368599847,
        lng: -89.7455209,
      },
      {
        Island: "Isabela",
        Site: "Puerto Pajas",
        lat: -0.755,
        lng: -91.375,
      },
    ],
  },
  1: {
    title:
      "Estudio del estado de la poblacion del flamenco de Galapagos y aves de laguna.",
    "Lead researcher": "Gustavo Jimenez",
    locations: [
      {
        Island: "Floreana",
        Site: "Montura",
        lat: -1.315595325,
        lng: -90.51053316,
      },
      {
        Island: "Floreana",
        Site: "Punta Cormorant",
        lat: -1.221551065,
        lng: -90.42814406,
      },
      {
        Island: "Santiago",
        Site: "Sartén",
        lat: -0.35643209,
        lng: -90.66205688,
      },
      {
        Island: "Santa Cruz",
        Site: "Garrapatero",
        lat: -0.692977287,
        lng: -90.2220813,
      },
      {
        Island: "Santa Cruz",
        Site: "Tortuga",
        lat: -0.761056229,
        lng: -90.34315443,
      },
      {
        Island: "Isabela",
        Site: "Barahona 1",
        lat: -0.996809427,
        lng: -91.05485548,
      },
      {
        Island: "Santiago",
        Site: "Bainbridge",
        lat: -0.351995867,
        lng: -90.56585229,
      },
    ],
  },
};

class DataComponent extends Component {
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
      shownData: initialData,
      selectedNode: undefined,
    };
  }

  isLinkOfNodeByID(link, nodeID) {
    return (
      ((link.source.id || link.source) === nodeID) |
      ((link.target.id || link.target) === nodeID)
    );
  }

  onNetworkClickNode = (d, callback) => {
    const { selectedNode } = this.state;
    if (!selectedNode) {
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

      const newData = Object.assign({}, data);
      newData.nodes = connectedNodes;
      newData.links = connectedLinks.values();
      this.setState(
        {
          shownData: newData,
          selectedNode: selectedNode?.id === d.id ? null : d,
        },
        () => callback()
      );
    } else {
      this.setState(
        {
          shownData: initialData,
          selectedNode: null,
        },
        () => callback()
      );
    }
  };

  onMarkerClicked = (marker, callback) => {
    const { selectedNode } = this.state;
    console.log('marker :>> ', marker);
  };

  render() {
    const { shownData, selectedNode } = this.state;
    let markers = [];
    _.map(testCoordinates, (value) => {
      markers = markers.concat(value.locations);
    });
    if (selectedNode) {
      markers = testCoordinates.hasOwnProperty(selectedNode.id)
        ? testCoordinates[selectedNode.id].locations
        : [];
    }
    return (
      <Grid container>
        <Grid item className="grid-item section section-0" xs={6}>
          <NetworkContainer
            data={shownData}
            selectedNode={selectedNode}
            onNodeClicked={(d, cb) => this.onNetworkClickNode(d, cb)}
          />
        </Grid>
        <Grid item className="grid-item section section-1" xs={6}>
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
