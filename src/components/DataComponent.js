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

  isLinkOfNode(link, node) {
    return (
      ((link.source.id || link.source) === node.id) |
      ((link.target.id || link.target) === node.id)
    );
  }

  areConnectedNodes(node1, node2) {
    const connectedIDs = [];
    data.links
      .filter((link) =>
        this.isLinkOfNode(link, node1)
      )
      .map((link) => {
        connectedIDs.push(link.source.id);
        connectedIDs.push(link.target.id);
        return true;
      });
    return connectedIDs.includes(node2.id);
  }

  onNetworkClickNode = (d, callback) => {
    const { selectedNode } = this.state;
    if (!selectedNode) {
      const connectedNodes = data.nodes.filter((node) =>
        this.areConnectedNodes(d, node)
      );
      const newData = Object.assign({}, data);
      newData.nodes = connectedNodes;
      newData.links = data.links.filter((link) => this.isLinkOfNode(link, d));
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
