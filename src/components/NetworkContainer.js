import React, { Component } from "react";
import * as d3 from "d3";
import { useTheme } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

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
      .force("collide", d3.forceCollide().radius(20).iterations(3));

    this.state = {
      simulation,
    };
  }

  async componentDidMount() {
    // Add an event listener that fires when the window get's resized
    window.addEventListener("resize", this.onResize, false);
    this.renderNetwork();
  }

  componentDidUpdate(prevProps) {
    const themesChanged = this.props.selectedThemes.length !== prevProps.selectedThemes.length;
    const policyPlansChanged = this.props.selectedPolicyPlans.length !== prevProps.selectedPolicyPlans.length;
    const categoriesChanged = this.props.selectedCategories.length !== prevProps.selectedCategories.length;
    const searchTextChanged = this.props.searchText !== prevProps.searchText;
    this.renderNetwork(themesChanged || policyPlansChanged || categoriesChanged || searchTextChanged);
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
    const { setZoomTransform } = this.props;
    setZoomTransform(t);
  };

  renderNetwork(resimulate) {
    const {
      refNetworkComponent,
      data,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedCategories,
      selectedPolicyPlans,
      selectedThemes,
      selectedThemesConnectedLinks,
      selectedThemesConnectedNodes,
      searchText,
      i18n,
      isStatic,
      zoom,
      zoomTransform,
    } = this.props;
    const { simulation } = this.state;
    Network(refNetworkComponent.current, {
      data,
      isStatic,
      simulation,
      resimulate,
      zoom,
      zoomTransform,
      setZoomTransform: this.setZoomTransform,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedCategories,
      selectedPolicyPlans,
      selectedThemes,
      selectedThemesConnectedLinks,
      selectedThemesConnectedNodes,
      searchText,
      onClick: this.onNetworkClickNode,
      language: i18n.language,
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
            position: "relative",
          }}
        />
      </StyledDiv>
    );
  }
};

export default withTranslation()(NetworkContainer);
