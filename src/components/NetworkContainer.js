import React, { Component } from "react";

import Network from "./Network";

class NetworkContainer extends Component {
  async componentDidMount() {
    // Add an event listener that fires when the window get's resized
    window.addEventListener("resize", this.onResize, false);
    this.renderNetwork();
  }

  componentDidUpdate() {
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

  onNetworkClickNode = (d) => {
    const { onNodeClicked } = this.props;
    onNodeClicked(d)
  };

  renderNetwork() {
    const {
      refNetworkComponent,
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
    } = this.props;
    Network(refNetworkComponent.current, {
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      onClick: this.onNetworkClickNode,
    });
  }

  render() {
    const height = window.innerHeight - 32;

    return (
        <div
            id="network"
            ref={this.props.refNetworkComponent}
            style={{height, maxWidth: "100%", margin: "0 auto" }}
        />
    );
  }
};

export default NetworkContainer;
