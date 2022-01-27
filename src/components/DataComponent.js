import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import NetworkContainer from "./NetworkContainer2";
// import Explanation from "./Explanation";
import { data } from "./RI";

const initialData = Object.assign({}, data);

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
        .filter((link) => connectedIDs.has(link.source.id) || connectedIDs.has(link.target.id))
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

  render() {
    const { shownData, selectedNode } = this.state;
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
          <div>Map goes here</div>
          {/* <Explanation /> */}
        </Grid>
      </Grid>
    );
  }
};

export default DataComponent;
