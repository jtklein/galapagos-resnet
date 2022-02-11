import React, { Component } from "react";

import Network from "./Network2";

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
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
    } = this.props;
    Network(this.refNetworkComponent.current, {
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      onClick: this.onNetworkClickNode,
    });
  }

  render() {
    const height = window.innerHeight;

    return (
        <div
            id="network"
            ref={this.refNetworkComponent}
            style={{height, maxWidth: "100%", margin: "0 auto" }}
        />
    );
  }
};

export default NetworkContainer;
