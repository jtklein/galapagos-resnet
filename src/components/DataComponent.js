import React, { Component, useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import IconDownload from "@material-ui/icons/CloudDownload";
import Search from "@material-ui/icons/Search";
import { withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { saveAs } from "file-saver";
import { isDesktop } from "react-device-detect";

import { useTranslation } from "react-i18next";
import classNames from "classnames";

import NetworkContainer from "./NetworkContainer";
// import MapComponent from "./MapComponent";

import { data } from "./RI";
import { locations } from "./RI_locations";

import "./DataComponent.css";

const onMobile = !isDesktop || window.innerWidth < 800;

const initialData = Object.assign({}, data);
const legendOpacity = 0.4;

const themes = {
  1: {
    labelEN: "Projects",
    color: "#660000",
  },
  2: {
    labelEN: "Years",
    color: "#ED6D22",
  },
  3: {
    labelEN: "Islands",
    color: "#cc0000",
  },
  4: {
    labelEN: "Species",
    color: "#ea9999",
  },
  5: {
    labelEN: "People",
    color: "#a4c2f4",
  },
  6: {
    labelEN: "Institutions",
    color: "#7023BD",
  },
  7: {
    labelEN: "Ecology and conservation",
    color: "#1c4587",
  },
  8: {
    labelEN: "Terrestrial fauna and flora",
    color: "#00FA9A",
  },
  9: {
    labelEN: "Marine/coastal fauna and flora",
    color: "#239ABD",
  },
  10: {
    labelEN: "Climate change",
    color: "#ADFF2F",
  },
  11: {
    labelEN: "History",
    color: "#FF8C00",
  },
  12: {
    labelEN: "Infrastructure, energy and technology",
    color: "#FF69B4",
  },
  13: {
    labelEN: "Food security",
    color: "#008B8B",
  },
  14: {
    labelEN: "Community",
    color: "#00FFFF",
  },
  15: {
    labelEN: "Politics, economics and crime",
    color: "#FFFF00",
  },
};

const ThemeLegend = ({
  selectedThemes,
  onThemeClicked,
  mobile,
  lowerBound,
  upperBound,
  open,
}) => {
  const { i18n } = useTranslation();

  return (
    <TutorialTooltip
      title="tutorialFilterTitle"
      description="tutorialFilterDescription"
      placement="right"
      open={open}
      index={3}
    >
      <Grid
        container
        direction={!mobile ? "column" : "row"}
        justifyContent="center"
        style={{
          padding: 5,
        }}
      >
        {Object.entries(themes).map(([key, theme]) => {
          if (key >= lowerBound && key <= upperBound) {
            return (
              <Grid
                item
                key={theme.color}
                className={classNames("link-item", "clickable")}
                style={{
                  opacity:
                    !selectedThemes ||
                    selectedThemes.length === 0 ||
                    selectedThemes.indexOf(theme.color) !== -1
                      ? 1
                      : legendOpacity,
                  display: "flex",
                }}
                onClick={() => onThemeClicked(theme.color)}
              >
                <span
                  width={50}
                  style={{
                    border: `1px solid ${theme.color}`,
                    backgroundColor: theme.color,
                    marginRight: 4,
                  }}
                >
                  &nbsp;&nbsp;&nbsp;
                </span>
                {i18n.language !== "es" ? theme.labelEN : theme.labelES}
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
    </TutorialTooltip>
  );
};

const DownloadButton = (props) => {
  const { t } = useTranslation();
  const matches = useMediaQuery("(max-width:1000px)");

  const CustomButton = withStyles((theme) => ({
    root: {
      fontSize: "0.9em",
      color: theme.palette.primary.contrastText,
    },
  }))(Button);

  return (
    <TutorialTooltip
      title="tutorialDownloadTitle"
      description="tutorialDownloadDescription"
      placement="right"
      open={props.open}
      index={5}
    >
      <div
        style={{
          padding: 5,
        }}
      >
        {matches && !props.mobile ? (
          <CustomButton
            variant="text"
            size="small"
            download="ods-galapagos.svg"
            onClick={props.onClick}
          >
            <IconDownload fontSize="large" />
          </CustomButton>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: props.mobile ? "row" : "column",
            }}
          >
            <IconDownload fontSize="medium" />
            <CustomButton
              variant="text"
              size="small"
              download="ods-galapagos.svg"
              onClick={props.onClick}
            >
              {t("download")}
            </CustomButton>
          </div>
        )}
      </div>
    </TutorialTooltip>
  );
};

const Legend = ({ selectedThemes, onThemeClicked, onClickSaveNetworkSVG, openTheme, openDownload }) => {
  const theme = useTheme();
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretch"
      style={{
        height: "100%",
        padding: 5,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: theme.typography.pxToRem(12),
        border: `1px solid ${theme.palette.primary.contrastText}`,
      }}
    >
      <Grid item xs style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
        <ThemeLegend
          selectedThemes={selectedThemes}
          onThemeClicked={(themeColor) => onThemeClicked(themeColor)}
          lowerBound={0}
          upperBound={6}
          open={openTheme}
        />
      </Grid>
      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>
      <Grid item xs style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
        <ThemeLegend
          selectedThemes={selectedThemes}
          onThemeClicked={(themeColor) => onThemeClicked(themeColor)}
          lowerBound={7}
          upperBound={Infinity}
        />
      </Grid>
      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>
      <Grid
        item
        xs
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexBasis: "auto",
          padding: 0,
        }}
      >
        <DownloadButton onClick={onClickSaveNetworkSVG} open={openDownload}/>
      </Grid>
    </Grid>
  );
};

const NodeInfo = ({ node }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();

  return (
    <div
      style={{
        marginTop: 40,
        padding: 5,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: theme.typography.pxToRem(12),
        border: `1px solid ${theme.palette.primary.contrastText}`,
      }}
    >
      {!node ? (
        <div>
          <strong>{i18n.t("selectANode")}</strong>
          <br />
          {i18n.t("toSeeMoreInformation")}
        </div>
      ) : (
        <div>
          <strong>{node.id}</strong>
          <br />
          {node.label}
        </div>
      )}
    </div>
  );
};

const SearchBar = ({ value, onChange }) => {
  const { i18n } = useTranslation();

  return (
    <TextField
      fullWidth
      id="searchbar"
      placeholder={i18n.t("searchBar")}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      value={value}
      onChange={onChange}
    />
  );
};

const StyledAlert = withStyles((theme) => ({
  standardInfo: {
    backgroundColor: theme.palette.primary.main,
    color: "rgba(255, 255, 255, 0.87)",
    maxWidth: 250,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #000000",
  },
}))(Alert);


const TutorialButton = ({ onClick }) => {
  const [closed, setClosed] = useState(false);
  const { i18n } = useTranslation();

  if (closed) {
    return null;
  }

  return (
    <div className="tutorial-button-container">
      <StyledAlert icon={false} severity="info" onClose={() => setClosed(true)}>
        <Button
          color="secondary"
          variant="contained"
          size="medium"
          onClick={onClick}
        >
          {i18n.t("tutorial")}
        </Button>
      </StyledAlert>
    </div>
  );
};

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.secondary.main,
    color: "rgba(255, 255, 255, 0.87)",
    maxWidth: 250,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #000000",
  },
}))(Tooltip);

const TutorialTooltip = ({
  children,
  title,
  description,
  placement,
  open,
  index,
}) => {
  const { i18n } = useTranslation();

  const titleElement = (
    <React.Fragment>
      <Typography color="inherit" align="center">
        {i18n.t(title)}
      </Typography>
      <div>{i18n.t(description)}</div>
      <br />
      <div>{index + 1 + "/6"}</div>
    </React.Fragment>
  );

  return (
    <HtmlTooltip
      title={titleElement}
      placement={placement}
      open={open}
      arrow={!onMobile}
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      {children}
    </HtmlTooltip>
  );
};


class DataComponent extends Component {
  constructor(props) {
    super(props);
    this.refNetworkComponent = React.createRef();
    this.state = {
      shownData: initialData,
      selectedNode: undefined,
      connectedNodes: undefined,
      selectedThemes: [],
      searchText: "",
      tutorialOpen: false,
      // This is a hack because on pressing the tutorial button also fires
      // the overall window click listener
      tutorialIndex: -1,
    };
  }

  componentDidMount() {
    // Add an event listener that fires when the window get's clicked
    window.addEventListener("click", this.onClick);
  }

  isLinkOfNodeByID(link, nodeID) {
    return (
      ((link.source.id || link.source) === nodeID) |
      ((link.target.id || link.target) === nodeID)
    );
  }

  setNodeSelection = (d) => {
    const { selectedNode } = this.state;
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
    // Commented out to only show direct (first degree) connections
    // data.links
    //   .filter(
    //     (link) =>
    //       connectedIDs.has(link.source.id) || connectedIDs.has(link.target.id)
    //   )
    //   .map((link) => {
    //     connectedIDs.add(link.source.id);
    //     connectedIDs.add(link.target.id);
    //     connectedLinks.add(link);
    //     return true;
    //   });

    // Map over all nodes to get connected nodes by ID
    const connectedNodes = data.nodes.filter((node) =>
      connectedIDs.has(node.id)
    );

    this.setState({
      connectedNodes: selectedNode?.id === d.id ? null : connectedNodes,
      connectedLinks:
        selectedNode?.id === d.id ? null : Array.from(connectedLinks.values()),
      selectedNode: selectedNode?.id === d.id ? null : d,
    });
  };

  onNetworkClickNode = (d) => {
    this.setNodeSelection(d);
    return;
  };

  onMarkerClicked = (marker) => {
    const { selectedNode } = this.state;
    if (selectedNode) {
      return;
    }
    const correspondingNode = data.nodes.filter(
      (node) => node.id === marker.Nickname
    )[0];
    this.setNodeSelection(correspondingNode);
  };

  filterMarkers = () => {
    const { selectedNode, connectedNodes } = this.state;
    const allMarkers = locations.filter(
      (location) => location.Latitude && location.Longitude
    );
    // If no node is selected show all markers
    if (!selectedNode) {
      return allMarkers;
    }
    // Get all selected + connected nodes
    const nodes = [selectedNode].concat(connectedNodes);
    let markers = [];
    // Map over this node set and collect all markers
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // TODO: put this hardcoded checks for "special" projects into the data pipeline
      if (node.id.includes("AT:")) {
        markers = markers.concat(
          allMarkers.filter((marker) => marker.Nickname === "Aves Terrestres")
        );
        break;
      }
      // TODO: put this hardcoded checks for "special" projects into the data pipeline
      if (node.id.includes("GV:")) {
        markers = markers.concat(
          allMarkers.filter((marker) => marker.Nickname === "Galapagos Verde")
        );
        break;
      }
      markers = markers.concat(
        allMarkers.filter((marker) => marker.Nickname === node.id)
      );
    }
    return markers;
  };

  onThemeClicked = (themeColor) => {
    const { selectedThemes } = this.state;
    const indexOfTheme = selectedThemes.indexOf(themeColor);
    this.setState({
      selectedThemes:
        indexOfTheme !== -1
          ? selectedThemes.filter((d, index) => index !== indexOfTheme)
          : selectedThemes.concat(themeColor),
    });
  };

  generateSVGContent = (parent) => {
    let svgContent = parent.innerHTML;
    svgContent = svgContent.replace(
      /^<svg/,
      [
        "<svg",
        'xmlns="http://www.w3.org/2000/svg"',
        'xmlns:xlink="http://www.w3.org/1999/xlink"',
        'version="1.1"',
      ].join(" ")
    );
    svgContent = svgContent.replace(/<\/svg>[\s\S]*/, "</svg>");
    // Safari inserts NS1/NS2 namespaces as xlink is not defined within the svg html
    svgContent = svgContent.replace("NS1", "xlink");
    svgContent = svgContent.replace("NS2", "xlink");
    return new Blob([svgContent], { type: "image/svg+xml" });
  };

  onClickSaveNetworkSVG = () => {
    const blob = this.generateSVGContent(this.refNetworkComponent.current);
    saveAs(blob, "rp-galapagos.svg");
  };

  onClick = () => {
    const { tutorialOpen, tutorialIndex } = this.state;
    if (!tutorialOpen) {
      return;
    }
    // If there are no more tutorial slides to show
    if (tutorialIndex === 5) {
      this.setState({
        tutorialOpen: false,
        tutorialIndex: -1,
        selectedNode: null,
        selectedThemes: null,
      });
      return;
    }

    if (tutorialIndex === -1) {
      this.setState({
        selectedThemes: [themes[1].color],
      });
    }
    if (tutorialIndex === 0) {
      this.setState({
        selectedThemes: [themes[1].color, themes[5].color],
      });
    }
    if (tutorialIndex === 1) {
      this.setState({
        selectedThemes: [themes[1].color, themes[8].color],
      });
    }
    if (tutorialIndex === 2) {
      this.setState({
        selectedThemes: [],
      });
    }
    this.setState({
      tutorialIndex: tutorialIndex + 1,
      // selectedNode: tutorialIndex >= 1 ? { id: "5.2" } : null,
    });
    if (tutorialIndex === -1 || tutorialIndex === 0 || tutorialIndex === 1 || tutorialIndex === 3) {
      window.scrollTo(0, 0);
    } else {
      const networkElement = document.getElementById("network");
      networkElement.scrollIntoView({
        inline: "center",
        block: "center",
        behavior: "smooth",
      });
    }
  };

  openOnDesktop = (index) => {
    if (onMobile) {
      return false;
    }
    const { tutorialOpen, tutorialIndex } = this.state;
    return tutorialOpen && tutorialIndex === index;
  };

  render() {
    const {
      shownData,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      searchText,
      tutorialOpen,
    } = this.state;
    // const markers = this.filterMarkers();
    return (
      <div>
        <SearchBar
          value={searchText}
          onChange={(e) => this.setState({ searchText: e.target.value })}
        />
        <Grid container>
          <Grid item className="grid-item" xs={2}>
            <Legend
              selectedThemes={selectedThemes}
              onThemeClicked={(themeColor) => this.onThemeClicked(themeColor)}
              onClickSaveNetworkSVG={this.onClickSaveNetworkSVG}
              openTheme={this.openOnDesktop(3)}
              openDownload={this.openOnDesktop(5)}
            />
          </Grid>
          {/* xs is sum of 12 */}
          <Grid item className="grid-item" xs={10}>
            <TutorialTooltip
              title="tutorialProjectsTitle"
              description="tutorialProjectsDescription"
              open={this.openOnDesktop(0)}
              placement="top"
              index={0}
            >
              <div></div>
            </TutorialTooltip>
            <TutorialTooltip
              title="tutorialInformationTitle"
              description="tutorialInformationDescription"
              open={this.openOnDesktop(1)}
              placement={"top"}
              index={1}
            >
              <div></div>
            </TutorialTooltip>
            <TutorialTooltip
              title="tutorialTopicsTitle"
              description="tutorialTopicsDescription"
              open={this.openOnDesktop(2)}
              placement={"top"}
              index={2}
            >
              <div></div>
            </TutorialTooltip>
            <TutorialTooltip
              title="tutorialNodesTitle"
              description="tutorialNodesDescription"
              open={this.openOnDesktop(4)}
              placement="top"
              index={4}
            >
              <div></div>
            </TutorialTooltip>
            <NetworkContainer
              refNetworkComponent={this.refNetworkComponent}
              data={shownData}
              selectedNode={selectedNode}
              connectedNodes={connectedNodes}
              connectedLinks={connectedLinks}
              selectedThemes={selectedThemes}
              searchText={searchText}
              onNodeClicked={(d, cb) => this.onNetworkClickNode(d, cb)}
            />
          </Grid>
          {/* <Grid item className="grid-item" xs={5}>
          <MapComponent
            markers={markers}
            onMarkerClicked={(m, cb) => this.onMarkerClicked(m, cb)}
          />
        </Grid> */}
        </Grid>
        <NodeInfo node={selectedNode} />
        <TutorialButton
          tutorialOpen={tutorialOpen}
          onClick={() => {
            this.setState({
              tutorialOpen: !tutorialOpen,
            });
          }}
        />
      </div>
    );
  }
}

export default DataComponent;
