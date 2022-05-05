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

import goal1EN from "../assets/icons/sdg/EN/E-WEB-Goal-01.png";
import goal2EN from "../assets/icons/sdg/EN/E-WEB-Goal-02.png";
import goal3EN from "../assets/icons/sdg/EN/E-WEB-Goal-03.png";
import goal4EN from "../assets/icons/sdg/EN/E-WEB-Goal-04.png";
import goal5EN from "../assets/icons/sdg/EN/E-WEB-Goal-05.png";
import goal6EN from "../assets/icons/sdg/EN/E-WEB-Goal-06.png";
import goal7EN from "../assets/icons/sdg/EN/E-WEB-Goal-07.png";
import goal8EN from "../assets/icons/sdg/EN/E-WEB-Goal-08.png";
import goal9EN from "../assets/icons/sdg/EN/E-WEB-Goal-09.png";
import goal11EN from "../assets/icons/sdg/EN/E-WEB-Goal-11.png";
import goal12EN from "../assets/icons/sdg/EN/E-WEB-Goal-12.png";
import goal14EN from "../assets/icons/sdg/EN/E-WEB-Goal-14.png";
import goal15EN from "../assets/icons/sdg/EN/E-WEB-Goal-15.png";
import goal16EN from "../assets/icons/sdg/EN/E-WEB-Goal-16.png";

import goal1ES from "../assets/icons/sdg/ES/S-WEB-Goal-01.png";
import goal2ES from "../assets/icons/sdg/ES/S-WEB-Goal-02.png";
import goal3ES from "../assets/icons/sdg/ES/S-WEB-Goal-03.png";
import goal4ES from "../assets/icons/sdg/ES/S-WEB-Goal-04.png";
import goal5ES from "../assets/icons/sdg/ES/S-WEB-Goal-05.png";
import goal6ES from "../assets/icons/sdg/ES/S-WEB-Goal-06.png";
import goal7ES from "../assets/icons/sdg/ES/S-WEB-Goal-07.png";
import goal8ES from "../assets/icons/sdg/ES/S-WEB-Goal-08.png";
import goal9ES from "../assets/icons/sdg/ES/S-WEB-Goal-09.png";
import goal11ES from "../assets/icons/sdg/ES/S-WEB-Goal-11.png";
import goal12ES from "../assets/icons/sdg/ES/S-WEB-Goal-12.png";
import goal14ES from "../assets/icons/sdg/ES/S-WEB-Goal-14.png";
import goal15ES from "../assets/icons/sdg/ES/S-WEB-Goal-15.png";
import goal16ES from "../assets/icons/sdg/ES/S-WEB-Goal-16.png";

import "./DataComponent.css";

const onMobile = !isDesktop || window.innerWidth < 800;

const initialData = Object.assign({}, data);
const legendOpacity = 0.4;

const themes = {
  1: {
    labelEN: "Projects",
    labelES: "Proyectos",
    color: "#660000",
  },
  2: {
    labelEN: "Years",
    labelES: "Años",
    color: "#ED6D22",
  },
  3: {
    labelEN: "Islands",
    labelES: "Islas",
    color: "#cc0000",
  },
  4: {
    labelEN: "Species",
    labelES: "Especies",
    color: "#ea9999",
  },
  5: {
    labelEN: "People",
    labelES: "Personas",
    color: "#a4c2f4",
  },
  6: {
    labelEN: "Institutions",
    labelES: "Instituciones",
    color: "#7023BD",
  },
  7: {
    labelEN: "Physical and chemical sciences",
    labelES: "Ciencias físicas y químicas",
    color: "#3c78d8",
  },
  8: {
    labelEN: "Ecology and conservation",
    labelES: "Conservación y ecología",
    color: "#1c4587",
  },
  9: {
    labelEN: "Terrestrial fauna and flora",
    labelES: "Flora y fauna terrestre",
    color: "#00FA9A",
  },
  10: {
    labelEN: "Marine/coastal fauna and flora",
    labelES: "Flora y fauna marina/costera",
    color: "#239ABD",
  },
  11: {
    labelEN: "Climate change",
    labelES: "Cambio climático",
    color: "#ADFF2F",
  },
  12: {
    labelEN: "History",
    labelES: "Historia",
    color: "#FF8C00",
  },
  13: {
    labelEN: "Infrastructure, energy and technology",
    labelES: "Infraestructura, energía y tecnología",
    color: "#FF69B4",
  },
  14: {
    labelEN: "Food security",
    labelES: "Seguridad alimentaria",
    color: "#ccbf2d",
  },
  15: {
    labelEN: "Community",
    labelES: "Comunidad",
    color: "#00FFFF",
  },
  16: {
    labelEN: "Politics, economics and crime",
    labelES: "Políticas, economía y delito",
    color: "#FFFF00",
  },
};

const plans = {
  1: {
    labelEN: "Governance",
    labelES: "Gobernanza",
    color: "#2E65CD",
  },
  2: {
    labelEN: "Community",
    labelES: "Comunidad",
    color: "#F7974A",
  },
  3: {
    labelEN: "Environment",
    labelES: "Entorno",
    color: "#54A87A",
  },
  4: {
    labelEN: "Habitat",
    labelES: "Hábitat",
    color: "#C7450F",
  },
  5: {
    labelEN: "Economy",
    labelES: "Economía",
    color: "#EEDA47",
  },
};

const targets = {
  1: {
    sourceEN: goal1EN,
    sourceES: goal1ES,
    color: "#E5243B",
  },
  2: {
    sourceEN: goal2EN,
    sourceES: goal2ES,
    color: "#DDA63A",
  },
  3: {
    sourceEN: goal3EN,
    sourceES: goal3ES,
    color: "#4C9F38",
  },
  4: {
    sourceEN: goal4EN,
    sourceES: goal4ES,
    color: "#C5192D",
  },
  5: {
    sourceEN: goal5EN,
    sourceES: goal5ES,
    color: "#C5192D",
  },
  6: {
    sourceEN: goal6EN,
    sourceES: goal6ES,
    color: "#26BDE2",
  },
  7: {
    sourceEN: goal7EN,
    sourceES: goal7ES,
    color: "#FCC30B",
  },
  8: {
    sourceEN: goal8EN,
    sourceES: goal8ES,
    color: "#A21942",
  },
  9: {
    sourceEN: goal9EN,
    sourceES: goal9ES,
    color: "#FD6925",
  },
  11: {
    sourceEN: goal11EN,
    sourceES: goal11ES,
    color: "#FD9D24",
  },
  12: {
    sourceEN: goal12EN,
    sourceES: goal12ES,
    color: "#BF8B2E",
  },
  14: {
    sourceEN: goal14EN,
    sourceES: goal14ES,
    color: "#0A97D9",
  },
  15: {
    sourceEN: goal15EN,
    sourceES: goal15ES,
    color: "#56C02B",
  },
  16: {
    sourceEN: goal16EN,
    sourceES: goal16ES,
    color: "#00689D",
  },
};

const questions = {
  1: {
    labelEN: "Tourism",
    labelES: "Turismo",
    color: "#ED551E",
  },
  2: {
    labelEN: "Development",
    labelES: "Desarrollo",
    color: "#A11EED",
  },
  3: {
    labelEN: "Planning",
    labelES: "Planificación",
    color: "#86931C",
  },
  4: {
    labelEN: "Education",
    labelES: "Educación",
    color: "#ED26C2",
  },
  5: {
    labelEN: "Agriculture",
    labelES: "Agricultura",
    color: "#ECCE48",
  },
  6: {
    labelEN: "Hydrology",
    labelES: "Hidrología",
    color: "#264EED",
  },
  7: {
    labelEN: "Invasive Species",
    labelES: "Especies invasoras",
    color: "#AC0A28",
  },
  8: {
    labelEN: "Marine",
    labelES: "Marina",
    color: "#48C1EC",
  },
  9: {
    labelEN: "Conservation",
    labelES: "Conservación",
    color: "#69EC48",
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

const LeftLegend = ({ selectedThemes, onThemeClicked, onClickSaveNetworkSVG, openTheme, openDownload }) => {
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

const PlanLegend = ({
  mobile,
}) => {
  const { i18n } = useTranslation();

  return (
    <Grid
      container
      direction={!mobile ? "column" : "row"}
      justifyContent="center"
      style={{
        padding: 5,
      }}
    >
      <Grid
        item
        style={{
          display: "flex",
        }}
      >
        {i18n.t('galapagosPlan')}
      </Grid>

      {Object.entries(plans).map(([key, plan]) => (
        <Grid
          item
          key={plan.color}
          className={classNames("link-item", "clickable")}
          style={{
            display: "flex",
          }}
          onClick={() => console.log(plan.color)}
        >
          <span
            width={50}
            style={{
              border: `1px solid ${plan.color}`,
              backgroundColor: plan.color,
              marginRight: 4,
            }}
          >
            &nbsp;&nbsp;&nbsp;
          </span>
          {i18n.language !== "es" ? plan.labelEN : plan.labelES}
        </Grid>
      ))}
    </Grid>
  );
};

const SDGIcon = ({ src, className, alt }) => (
  <img src={src} className={className} alt={alt} />
);

const TargetLegend = ({ mobile }) => {
  const { i18n } = useTranslation();
  const iconClassName = "sdg-icon";
  const TargetColumn = ({sliceBeginning, sliceEnd}) => (
    <Grid container direction={"column"}>
      {Object.entries(targets)
        .slice(sliceBeginning, sliceEnd)
        .map(([key, target]) => (
          <Grid item key={key}>
            <SDGIcon
              src={i18n.language !== "es" ? target.sourceEN : target.sourceES}
              className={classNames(iconClassName, "clickable")}
              alt="sdg-icon"
            />
          </Grid>
        ))}
    </Grid>
  );
;

  return (
    <Grid
      container
      direction={"column"}
      justifyContent="center"
      style={{
        padding: 5,
      }}
    >
      <Grid
        item
        style={{
          display: "flex",
        }}
      >
        {i18n.t("priorityTargets")}
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
        }}
      >
        <Grid
          container
          direction={"row"}
          spacing={1}
          justifyContent="space-evenly"
          style={{
            padding: 0,
          }}
        >
          <Grid item>
            <TargetColumn sliceBeginning={0} sliceEnd={5} />
          </Grid>
          <Grid item>
            <TargetColumn sliceBeginning={5} sliceEnd={10} />
          </Grid>
          <Grid item>
            <TargetColumn sliceBeginning={10} sliceEnd={15} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const QuestionLegend = ({ mobile }) => {
  const { i18n } = useTranslation();

  return (
    <Grid
      container
      direction={!mobile ? "column" : "row"}
      justifyContent="center"
      style={{
        padding: 5,
      }}
    >
      <Grid
        item
        style={{
          display: "flex",
        }}
      >
        {i18n.t("topQuestions")}
      </Grid>

      {Object.entries(questions).map(([key, question]) => (
        <Grid
          item
          key={question.color}
          className={classNames("link-item", "clickable")}
          style={{
            display: "flex",
          }}
          onClick={() => console.log(question.color)}
        >
          <span
            width={50}
            style={{
              border: `1px solid ${question.color}`,
              backgroundColor: question.color,
              marginRight: 4,
            }}
          >
            &nbsp;&nbsp;&nbsp;
          </span>
          {i18n.language !== "es" ? question.labelEN : question.labelES}
        </Grid>
      ))}
    </Grid>
  );
};

const RightLegend = ({
  selectedThemes,
  onThemeClicked,
  onClickSaveNetworkSVG,
  openTheme,
  openDownload,
}) => {
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
        <PlanLegend />
      </Grid>
      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>
      <Grid item xs style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
        <TargetLegend />
      </Grid>
      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>
      <Grid item xs style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
        <QuestionLegend />
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

const MobileTutorial = ({ index }) => {
  return (
    <div>
      <TutorialTooltip
        title="tutorialProjectsTitle"
        description="tutorialProjectsDescription"
        open={index === 0}
        index={index}
      >
        <div />
      </TutorialTooltip>
      <TutorialTooltip
        title="tutorialInformationTitle"
        description="tutorialInformationDescription"
        open={index === 1}
        index={index}
      >
        <div />
      </TutorialTooltip>
      <TutorialTooltip
        title="tutorialTopicsTitle"
        description="tutorialTopicsDescription"
        open={index === 2}
        index={index}
      >
        <div />
      </TutorialTooltip>
      <TutorialTooltip
        title="tutorialFilterTitle"
        description="tutorialFilterDescription"
        open={index === 3}
        placement="top"
        index={index}
      >
        <div />
      </TutorialTooltip>
      <TutorialTooltip
        title="tutorialNodesTitle"
        description="tutorialNodesDescription"
        open={index === 4}
        placement="top"
        index={index}
      >
        <div />
      </TutorialTooltip>
      <TutorialTooltip
        title="tutorialDownloadTitle"
        description="tutorialDownloadDescription"
        open={index === 5}
        placement="top"
        index={index}
      >
        <div />
      </TutorialTooltip>
    </div>
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
    if (
      (tutorialIndex === -1 ||
        tutorialIndex === 0 ||
        tutorialIndex === 1 ||
        tutorialIndex === 3) &&
      !onMobile
    ) {
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

  renderDesktop() {
    const {
      shownData,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      searchText,
    } = this.state;
    // const markers = this.filterMarkers();

    return (
      <Grid container>
        <Grid item className="grid-item" xs={2} style={{ padding: 0 }}>
          <LeftLegend
            selectedThemes={selectedThemes}
            onThemeClicked={(themeColor) => this.onThemeClicked(themeColor)}
            onClickSaveNetworkSVG={this.onClickSaveNetworkSVG}
            openTheme={this.openOnDesktop(3)}
            openDownload={this.openOnDesktop(5)}
          />
        </Grid>
        {/* xs is sum of 12 */}
        <Grid item className="grid-item" xs={8} style={{ padding: 0 }}>
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
        <Grid item className="grid-item" xs={2} style={{ padding: 0 }}>
          <RightLegend />
        </Grid>

        {/* <Grid item className="grid-item" xs={5}>
            <MapComponent
              markers={markers}
              onMarkerClicked={(m, cb) => this.onMarkerClicked(m, cb)}
            />
          </Grid> */}
      </Grid>
    );
  }

  renderMobile() {
    const {
      shownData,
      selectedNode,
      connectedNodes,
      connectedLinks,
      selectedThemes,
      searchText,
      tutorialOpen,
      tutorialIndex,
    } = this.state;
    const height = window.innerHeight;
    const minHeight = 520;

    return (
      <div style={{ width: "100%" }}>
        <div style={{ height, minHeight }}>
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
        </div>
        {tutorialOpen ? <MobileTutorial index={tutorialIndex} /> : null}
        <LeftLegend
          selectedThemes={selectedThemes}
          onThemeClicked={(themeColor) => this.onThemeClicked(themeColor)}
          onClickSaveNetworkSVG={this.onClickSaveNetworkSVG}
          openTheme={this.openOnDesktop(3)}
          openDownload={this.openOnDesktop(5)}
        />
        <RightLegend />
      </div>
    );
  }

  render() {
    const { selectedNode, searchText, tutorialOpen } = this.state;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <SearchBar
            value={searchText}
            onChange={(e) => this.setState({ searchText: e.target.value })}
          />
        </div>
        {onMobile ? this.renderMobile() : this.renderDesktop()}
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
