import React, { Component } from "react";
import * as d3 from "d3";

import Network from "./Network";

class NetworkContainer extends Component {
  constructor(props) {
    super(props);
    const simulation = d3
      .forceSimulation()
      .nodes(props.data.nodes)
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "link",
        d3.forceLink(props.data.links).id((d) => d.id)
      )
      .force("collide", d3.forceCollide());
    const ancZoom = d3.zoom();
    const zoom = d3.zoom();
    this.state = {
      simulation,
      ancZoom,
      zoom
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
      // Re-render network with new size
      this.renderNetwork();
    });
  };

  onNetworkClickNode = (d) => {
    const { onNodeClicked } = this.props;
    onNodeClicked(d);
  };

  renderNetwork() {
    const {
      refNetworkComponent,
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      searchText
    } = this.props;
    const { simulation, ancZoom, zoom } = this.state;
    Network(refNetworkComponent.current, {
      data,
      simulation,
      ancZoom,
      zoom,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      searchText,
      onClick: this.onNetworkClickNode,
    });
  }

  render() {
    const height = window.innerHeight - 32;

    return (
      <div
        id="network"
        ref={this.props.refNetworkComponent}
        style={{ height, maxWidth: "100%", margin: "0 auto" }}
      />
    );
  }
};

export default NetworkContainer;
