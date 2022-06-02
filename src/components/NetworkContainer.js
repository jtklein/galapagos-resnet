import React, { Component } from "react";
import * as d3 from "d3";
import { useTheme } from "@material-ui/core/styles";

import Network from "./Network";

const StyledDiv = (props) => {
  const theme = useTheme();
  return (
    <div
      {...props}
      style={{
        ...props.style,
        border: `1px solid ${theme.palette.primary.contrastText}`,
      }}
    >
      {props.children}
    </div>
  );
};

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
      .force(
        "collide",
        d3
          .forceCollide()
          .radius(20)
          .iterations(3)
      );
    const zoom = d3.zoom();
    // Holds a copy of the previous zoom transform, so we can track its changes
    const zoomTransform = d3.zoomIdentity;

    this.state = {
      simulation,
      zoom,
      zoomTransform,
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

  setZoomTransform = (t) => {
    this.setState({ zoomTransform: t });
  };

  renderNetwork() {
    const {
      refNetworkComponent,
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedCategories,
      selectedThemes,
      selectedThemeNodes,
      selectedThemeNodesConnectedLinks,
      selectedThemeNodesConnectedNodes,
      searchText,
    } = this.props;
    const { simulation, zoom, zoomTransform } = this.state;
    Network(refNetworkComponent.current, {
      data,
      simulation,
      zoom,
      zoomTransform,
      setZoomTransform: this.setZoomTransform,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedCategories,
      selectedThemes,
      selectedThemeNodes,
      selectedThemeNodesConnectedLinks,
      selectedThemeNodesConnectedNodes,
      searchText,
      onClick: this.onNetworkClickNode,
    });
  }

  render() {
    return (
      <StyledDiv
        style={{
          height: "100%",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <div
          ref={this.props.refNetworkComponent}
          id="network"
          style={{
            height: "100%",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        />
      </StyledDiv>
    );
  }
};

export default NetworkContainer;
