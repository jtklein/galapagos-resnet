import React, { Component } from "react";

import Network from "./Network2";

const linkColors = {
  "-3": "#660000",
  "-2": "#cc0000",
  "-1": "#ea9999",
  1: "#a4c2f4",
  2: "#3c78d8",
  3: "#1c4587",
};

class NetworkContainer extends Component {
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
    };
  }

  async componentDidMount() {
    // Add an event listener that fires when the window get's resized
    window.addEventListener("resize", this.onResize, false);
    this.renderNetwork();
  }

  onResize = () => {
    if (this.rqf) {
      return;
    }
    this.rqf = window.requestAnimationFrame(() => {
      this.rqf = null;
      // Re-render chart with new size
      this.renderNetwork();
    });
  };

  linkColor = (d) => {
    return linkColors[d.weight];
  };

  onNetworkClickNode = (d) => {
    const { onNodeClicked } = this.props;
    onNodeClicked(d, () => this.renderNetwork())
  };

  renderNetwork() {
    const {
      data,
      selectedNode,
    } = this.props;
    Network(this.refNetworkComponent.current, {
      data,
      selectedNode,
      onClick: this.onNetworkClickNode,
      linkColor: this.linkColor,
    });
  }

  render() {
    const height = window.innerHeight;

    return (
        <div
            id="network"
            ref={this.refNetworkComponent}
            style={{ height, maxWidth: height, margin: "0 auto" }}
        />
    );
  }
};

export default NetworkContainer;
