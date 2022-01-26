import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import NetworkContainer from "./NetworkContainer2";
// import Explanation from "./Explanation";
import { data } from "./RI";

class DataComponent extends Component {
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
      data,
      selectedNode: undefined,
    };
  }

  onNetworkClickNode = (d, callback) => {
    const { selectedNode } = this.state;
    this.setState(
      {
        selectedNode: selectedNode?.id === d.id ? null : d,
      },
      () => callback()
    );
  };

  render() {
    const { data, selectedNode } = this.state;
    return (
      <Grid container>
        <Grid item className="grid-item section section-0" xs={6}>
          <NetworkContainer
            data={data}
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
