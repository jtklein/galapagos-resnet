import React, { Component } from "react";
import * as d3 from "d3";

import Network from "./Network";
import { data } from "./RI";

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
      data,
      selectedNode: undefined,
      selectedThemes: [],
      selectedLinkWeights: [],
      selectedDirection: undefined,
      width: undefined,
      height: undefined,
      tutorialOpen: false,
      // This is a hack because on pressing the tutorial button also fires
      // the overall window click listener
      tutorialIndex: -1,
      mobileNetworkSize: Math.min(
        window.innerHeight - 40,
        window.innerWidth - 40
      ),
    };
  }

  async componentDidMount() {
    // Add an event listener that fires when the window get's resized
    window.addEventListener("resize", this.onResize, false);
    // Add an event listener that fires when the window get's clicked
    window.addEventListener("click", this.onClick);
    this.initData();
    this.renderNetwork();
  }

  initData() {
    const height = parseInt(d3.select("#network").style("height"));
    const width = parseInt(d3.select("#network").style("width"));
    const centerX = width / 2;
    const centerY = height / 2;
    let growthAngle = 0;
    let deltaAngle = 137.5;
    let d2r = Math.PI / 180;
    let growthDist = 0;
    let counter = 1;
    data.nodes.sort((a, b) => b.size - a.size);
    data.nodes.forEach((node, index) => {
      growthAngle += deltaAngle;
      // establish point x and y
      const penX = Math.cos(growthAngle * d2r) * centerX * growthDist;
      const penY = Math.sin(growthAngle * d2r) * centerY * growthDist;

      node.x = penX + centerX;
      node.y = penY + centerY;
      // growth dist will give x and Y with simple trig
      const indexModulo = index % 5;
      if (indexModulo === 0) {
        growthDist += 0.35 / counter;
        counter++;
      }
    });
    this.setState({ data, width, height });
  }

  onResize = () => {
    if (this.rqf) {
      return;
    }
    this.rqf = window.requestAnimationFrame(() => {
      this.rqf = null;
      // Recalculate nodes positions
      const { height, width } = this.state;
      const newHeight = parseInt(d3.select("#network").style("height"));
      const newWidth = parseInt(d3.select("#network").style("width"));

      const widthAspect = newWidth / width;
      const heightAspect = newHeight / height;

      data.nodes.forEach((node, index) => {
        node.x = node.x * widthAspect;
        node.y = node.y * heightAspect;
      });
      this.setState({ height: newHeight, width: newWidth });
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
