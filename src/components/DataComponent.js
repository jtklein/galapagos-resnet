import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import NetworkContainer from "./NetworkContainer";
// import MapComponent from "./MapComponent";

import { data } from "./RI";
import { locations } from "./RI_locations";

import "./DataComponent.css";

const initialData = Object.assign({}, data);
const legendOpacity = 0.4;

const themes = {
  1: {
    labelEN: "Projects",
    color: "#660000",
  },
  2: {
    labelEN: "Years",
    color: "#ED6D22",
  },
  3: {
    labelEN: "Islands",
    color: "#cc0000",
  },
  4: {
    labelEN: "Species",
    color: "#ea9999",
  },
  5: {
    labelEN: "Ecology and conservation",
    color: "#1c4587",
  },
  6: {
    labelEN: "Terrestrial fauna and flora",
    color: "#00FA9A",
  },
  7: {
    labelEN: "Marine/coastal fauna and flora",
    color: "#8A2BE2",
  },
  8: {
    labelEN: "Climate change",
    color: "#ADFF2F",
  },
  9: {
    labelEN: "History",
    color: "#FF8C00",
  },
  10: {
    labelEN: "Infrastructure, energy and technology",
    color: "#FF69B4",
  },
  11: {
    labelEN: "Food security",
    color: "#008B8B",
  },
  12: {
    labelEN: "Community",
    color: "#00FFFF",
  },
  13: {
    labelEN: "Politics, economics and crime",
    color: "#FFFF00",
  },
};

const Legend = ({ selectedThemes, onThemeClicked, mobile }) => {
  const colorTheme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Grid
      container
      direction={!mobile ? "column" : "row"}
      justifyContent="center"
      style={{
        padding: 5,
        backgroundColor: colorTheme.palette.primary.main,
        color: colorTheme.palette.primary.contrastText,
        fontSize: colorTheme.typography.pxToRem(12),
        border: `1px solid ${colorTheme.palette.primary.contrastText}`,
      }}
    >
      {Object.entries(themes).map(([key, theme]) => (
        <Grid
          item
          key={theme.color}
          className={classNames("link-item", "clickable")}
          style={{
            opacity:
              !selectedThemes ||
              selectedThemes.length === 0 ||
              selectedThemes.indexOf(theme.color) !== -1
                ? 1
                : legendOpacity,
            display: "flex",
          }}
          onClick={() => onThemeClicked(theme.color)}
        >
          <span
            width={50}
            style={{
              border: `1px solid ${theme.color}`,
              backgroundColor: theme.color,
              marginRight: 4,
            }}
          >
            &nbsp;&nbsp;&nbsp;
          </span>
          {i18n.language !== "es" ? theme.labelEN : theme.labelES}
        </Grid>
      ))}
    </Grid>
  );
};

const NodeInfo = ({ node }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();

  return (
      <div
        style={{
          marginTop: 40,
          padding: 5,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontSize: theme.typography.pxToRem(12),
          border: `1px solid ${theme.palette.primary.contrastText}`,
        }}
      >
        {!node ? (
          <div>
            <strong>{i18n.t("selectANode")}</strong>
            <br />
            {i18n.t("toSeeMoreInformation")}
          </div>
        ) : (
          <div>
            <strong>
              {node.id}
            </strong>
            <br />
              {node.label}
          </div>
        )}
      </div>
  );
};

class DataComponent extends Component {
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
      shownData: initialData,
      selectedNode: undefined,
      connectedNodes: undefined,
      selectedThemes: [],
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
    // Commented out to only show direct (first degree) connections
    // data.links
    //   .filter(
    //     (link) =>
    //       connectedIDs.has(link.source.id) || connectedIDs.has(link.target.id)
    //   )
    //   .map((link) => {
    //     connectedIDs.add(link.source.id);
    //     connectedIDs.add(link.target.id);
    //     connectedLinks.add(link);
    //     return true;
    //   });

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
    const { selectedNode, connectedNodes } = this.state;
    const allMarkers = locations.filter(
      (location) => location.Latitude && location.Longitude
    );
    // If no node is selected show all markers
    if (!selectedNode) {
      return allMarkers;
    }
    // Get all selected + connected nodes
    const nodes = [selectedNode].concat(connectedNodes);
    let markers = [];
    // Map over this node set and collect all markers
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // TODO: put this hardcoded checks for "special" projects into the data pipeline
      if (node.id.includes("AT:")) {
        markers = markers.concat(
          allMarkers.filter((marker) => marker.Nickname === "Aves Terrestres")
        );
        break;
      }
      // TODO: put this hardcoded checks for "special" projects into the data pipeline
      if (node.id.includes("GV:")) {
        markers = markers.concat(
          allMarkers.filter((marker) => marker.Nickname === "Galapagos Verde")
        );
        break;
      }
      markers = markers.concat(
        allMarkers.filter((marker) => marker.Nickname === node.id)
      );
    }
    return markers;
  };

  onThemeClicked = (themeColor) => {
    const { selectedThemes } = this.state;
    const indexOfTheme = selectedThemes.indexOf(themeColor);
    this.setState({
      selectedThemes:
        indexOfTheme !== -1
          ? selectedThemes.filter((d, index) => index !== indexOfTheme)
          : selectedThemes.concat(themeColor),
    });
  };

  render() {
    const {
      shownData,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
    } = this.state;
    // const markers = this.filterMarkers();
    return (
      <div>
        <Grid container>
          <Grid item className="grid-item" xs={2}>
            <Legend
              selectedThemes={selectedThemes}
              onThemeClicked={(themeColor) => this.onThemeClicked(themeColor)}
            />
          </Grid>
          {/* xs is sum of 12 */}
          <Grid item className="grid-item" xs={10}>
            <NetworkContainer
              data={shownData}
              selectedNode={selectedNode}
              connectedNodes={connectedNodes}
              connectedLinks={connectedLinks}
              selectedThemes={selectedThemes}
              onNodeClicked={(d, cb) => this.onNetworkClickNode(d, cb)}
            />
          </Grid>
          {/* <Grid item className="grid-item" xs={5}>
          <MapComponent
            markers={markers}
            onMarkerClicked={(m, cb) => this.onMarkerClicked(m, cb)}
          />
        </Grid> */}
        </Grid>
        <NodeInfo node={selectedNode} />
      </div>
    );
  }
};

export default DataComponent;
