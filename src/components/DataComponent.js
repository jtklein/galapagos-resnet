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

import { data } from "../data/RI";
import { locations } from "../data/RI_locations";
import projectsInfo from "../data/projects";
import organizationsInfo from "../data/orgs_info";
import speciesInfo from "../data/species_info";
import plansInfo from "../data/plans_info";

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

const legendOpacity = 0.4;

const nodeCategories = {
  1: {
    labelEN: "Projects",
    labelES: "Proyectos",
    color: "#B71C1C",
  },
  2: {
    labelEN: "Years",
    labelES: "A??os",
    color: "#FDD835",
  },
  3: {
    labelEN: "Islands",
    labelES: "Islas",
    color: "#33691E",
  },
  4: {
    labelEN: "Countries",
    labelES: "Paises",
    color: "#5D4037",
  },
  5: {
    labelEN: "Species",
    labelES: "Especies",
    color: "#F57F17",
  },
  6: {
    labelEN: "People",
    labelES: "Personas",
    color: "#4A148C",
  },
  7: {
    labelEN: "Institutions",
    labelES: "Instituciones",
    color: "#006064",
  },
};

const themes = {
  1: {
    labelEN: "Physical and chemical sciences",
    labelES: "Ciencias f??sicas y qu??micas",
    color: "#1A237E",
  },
  2: {
    labelEN: "Ecology and conservation",
    labelES: "Conservaci??n y ecolog??a",
    color: "#303F9F",
  },
  3: {
    labelEN: "Terrestrial fauna and flora",
    labelES: "Flora y fauna terrestre",
    color: "#5C6BC0",
  },
  4: {
    labelEN: "Marine/coastal fauna and flora",
    labelES: "Flora y fauna marina/costera",
    color: "#0D47A1",
  },
  5: {
    labelEN: "Climate change",
    labelES: "Cambio clim??tico",
    color: "#1976D2",
  },
  // 6: {
  //   labelEN: "History",
  //   labelES: "Historia",
  //   color: "#FF8C00",
  // },
  7: {
    labelEN: "Infrastructure, energy and technology",
    labelES: "Infraestructura, energ??a y tecnolog??a",
    color: "#01579B",
  },
  // 8: {
  //   labelEN: "Food security",
  //   labelES: "Seguridad alimentaria",
  //   color: "#0288D1",
  // },
  9: {
    labelEN: "Community",
    labelES: "Comunidad",
    color: "#29B6F6",
  },
  10: {
    labelEN: "Politics, economics and crime",
    labelES: "Pol??ticas, econom??a y delito",
    color: "#81D4FA",
  },
};

const policyPlans = {
  1: {
    labelEN: "40 Priority SDG Targets",
    labelES: "40 Metas Prioritarias de los ODS",
    color: "#EF5350",
  },
  2: {
    labelEN: "Objectives of the 2030 Plan",
    labelES: "Objetivos del Plan 2030",
    color: "#BA68C8",
  },
  3: {
    labelEN: "50 Top Questions",
    labelES: "50 Preguntas Principales",
    color: "#4DB6AC",
  },
  4: {
    labelEN: "Policy Recommendations for Galapagos",
    labelES: "Recomendaciones de Pol??ticas P??blicas para Gal??pagos",
    color: "#FF8A65",
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
    labelES: "H??bitat",
    color: "#C7450F",
  },
  5: {
    labelEN: "Economy",
    labelES: "Econom??a",
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
    labelES: "Planificaci??n",
    color: "#86931C",
  },
  4: {
    labelEN: "Education",
    labelES: "Educaci??n",
    color: "#ED26C2",
  },
  5: {
    labelEN: "Agriculture",
    labelES: "Agricultura",
    color: "#ECCE48",
  },
  6: {
    labelEN: "Hydrology",
    labelES: "Hidrolog??a",
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
    labelES: "Conservaci??n",
    color: "#69EC48",
  },
};

/* Data preparation */

// Get sets of the values used as node IDs
const nicknamesESSet = new Set(projectsInfo.map((d) => d.Nickname_ES));
const orgCodeSet = new Set(organizationsInfo.map((d) => d.Org));
const scientificNameSet = new Set(speciesInfo.map((d) => d.Scientific_name));
const aimSet = new Set(plansInfo.map((d) => d.Aim));

// Map through the data to add the info to the node
data.nodes = data.nodes.map(node => {
  if (nicknamesESSet.has(node.id)) {
    const nodeInfo = projectsInfo.find(d => d.Nickname_ES === node.id);
    node = { ...node, ...nodeInfo };
  }
  if (orgCodeSet.has(node.id)) {
    const nodeInfo = organizationsInfo.find(d => d.Org === node.id);
    node = { ...node, ...nodeInfo };
  }
  if (scientificNameSet.has(node.id)) {
    const nodeInfo = speciesInfo.find(d => d.Scientific_name === node.id);
    node = { ...node, ...nodeInfo };
  }
  if (aimSet.has(node.id)) {
    const nodeInfo = plansInfo.find(d => d.Aim === node.id);
    node = { ...node, ...nodeInfo };
  }
  return node;
})

const initialData = Object.assign({}, data);

/* Data preparation */

const CategoriesLegend = ({
  selectedCategories,
  onCategoryClicked,
  mobile,
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
        {Object.entries(nodeCategories).map(([key, category]) => {
          return (
            <Grid
              item
              key={category.color}
              className={classNames("link-item", "clickable")}
              style={{
                opacity:
                  !selectedCategories ||
                  selectedCategories.length === 0 ||
                  selectedCategories.indexOf(category.color) !== -1
                    ? 1
                    : legendOpacity,
                display: "flex",
              }}
              onClick={() => onCategoryClicked(category.color)}
            >
              <span
                width={50}
                style={{
                  border: `1px solid ${category.color}`,
                  backgroundColor: category.color,
                  marginRight: 4,
                }}
              >
                &nbsp;&nbsp;&nbsp;
              </span>
              {i18n.language !== "es" ? category.labelEN : category.labelES}
            </Grid>
          );
        })}
      </Grid>
    </TutorialTooltip>
  );
};

const ThemeLegend = ({
  selectedThemes,
  onThemeClicked,
  mobile,
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
        })}
      </Grid>
    </TutorialTooltip>
  );
};

const PolicyPlansLegend = ({ selectedPolicyPlans, onPolicyPlanClicked, mobile, open }) => {
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
      {Object.entries(policyPlans).map(([key, policyPlan]) => {
        return (
          <Grid
            item
            key={policyPlan.color}
            className={classNames("link-item", "clickable")}
            style={{
              opacity:
                !selectedPolicyPlans ||
                selectedPolicyPlans.length === 0 ||
                selectedPolicyPlans.indexOf(policyPlan.color) !== -1
                  ? 1
                  : legendOpacity,
              display: "flex",
            }}
            onClick={() => onPolicyPlanClicked(policyPlan.color)}
          >
            <span
              width={50}
              style={{
                border: `1px solid ${policyPlan.color}`,
                backgroundColor: policyPlan.color,
                marginRight: 4,
              }}
            >
              &nbsp;&nbsp;&nbsp;
            </span>
            {i18n.language !== "es" ? policyPlan.labelEN : policyPlan.labelES}
          </Grid>
        );
      })}
    </Grid>
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

const LeftLegend = ({ mobile, selectedThemes, selectedCategories, selectedPolicyPlans, onPolicyPlanClicked, onThemeClicked, onCategoryClicked, onClickSaveNetwork, openTheme, openDownload }) => {
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
        <CategoriesLegend
          mobile={mobile}
          selectedCategories={selectedCategories}
          onCategoryClicked={(categoryColor) =>
            onCategoryClicked(categoryColor)
          }
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
          mobile={mobile}
          selectedThemes={selectedThemes}
          onThemeClicked={(themeColor) => onThemeClicked(themeColor)}
        />
      </Grid>
      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>
        <PolicyPlansLegend
          mobile={mobile}
          selectedPolicyPlans={selectedPolicyPlans}
          onPolicyPlanClicked={(themeColor) => onPolicyPlanClicked(themeColor)}
        />
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
        <DownloadButton
          mobile={mobile}
          onClick={onClickSaveNetwork}
          open={openDownload}
        />
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
  const TargetColumn = ({ sliceBeginning, sliceEnd }) => (
    <Grid container direction={!mobile ? "column" : "row"}>
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

  const DesktopLayout = <Grid
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
          <Grid
            container
            direction={!mobile ? "row" : "column"}
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
      </Grid>;

  const MobileLayout = (
    <Grid
      container
      direction={!mobile ? "column" : "row"}
      justifyContent="center"
      style={{
        padding: 0,
        height: "100%",
        alignItems: "center",
      }}
    >
      {Object.entries(targets).map(([key, target]) => (
        <Grid
          item
          key={key}
          style={{
            flex: "1 0 calc(14.3% - 8px)",
            padding: 4,
            maxWidth: "68px",
            cursor: "pointer",
          }}
        >
          <SDGIcon
            src={i18n.language !== "es" ? target.sourceEN : target.sourceES}
            className={classNames(iconClassName, "clickable")}
            alt="sdg-icon"
          />
        </Grid>
      ))}
    </Grid>
  );

  return mobile ? MobileLayout : DesktopLayout;
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
  mobile,
  iconClassName,
}) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
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
      <Grid item xs>
        <div style={{ width: "100%" }}>{i18n.t("galapagosPlan")}</div>
        <div style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
          <PlanLegend mobile={mobile} />
        </div>
      </Grid>

      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>

      <Grid item xs>
        <div style={{ width: "100%" }}>{i18n.t("priorityTargets")}</div>
        <div style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
          <TargetLegend mobile={mobile} iconClassName={iconClassName} />
        </div>
      </Grid>

      <Grid
        item
        xs
        style={{ display: "contents", flexBasis: "auto", padding: 5 }}
      >
        <hr className="solid"></hr>
      </Grid>

      <Grid item xs>
        <div style={{ width: "100%" }}>{i18n.t("topQuestions")}</div>
        <div style={{ display: "flex", flexBasis: "auto", padding: 0 }}>
          <QuestionLegend mobile={mobile} />
        </div>
      </Grid>
    </Grid>
  );
};
console.log('RightLegend', RightLegend);

const NodeInfo = ({ node }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const ProjectNode = ({ info }) => { 
    return (
      <div>
        <br />
        <strong>
          {i18n.language !== "es" ? info.Nickname_EN : info.Nickname_ES}
        </strong>
        <br />
        {info.Permit && (
          <>
            {i18n.t("permitNumber")} {info.Permit}
            <br />
            <br />
          </>
        )}
        {info.Title_EN && (
          <>
            {i18n.language !== "es" ? info.Title_EN : info.Title_ES}
            <br />
            <br />
          </>
        )}
        {info.Summary_EN && (
          <>
            {i18n.language !== "es" ? info.Summary_EN : info.Summary_ES}
            <br />
            <br />
          </>
        )}
        {info.Link && (
          <>
            <a href={info.Link} target="_blank" rel="noreferrer">
              {i18n.t("relevantLinks")}
            </a>
            <br />
            <br />
          </>
        )}
      </div>
    );};

  const OrganizationNode = ({ info }) => {
    return (
      <div>
        <br />
        <strong>{info.Org}</strong>
        <br />
        {info["English name"] && (
          <>
            {i18n.language !== "es"
              ? info["English name"]
              : info["Spanish name"]}
            <br />
            <br />
          </>
        )}
        {info["Country"] && (
          <>
            {i18n.language !== "es"
              ? info["Country"]
              : info["Pais"]}
            <br />
            <br />
          </>
        )}
        {info.Website && (
          <>
            <a href={info.Website} target="_blank" rel="noreferrer">
              {i18n.t("website")}
            </a>
            <br />
            <br />
          </>
        )}
      </div>
    );
  };

  const SpeciesNode = ({ info }) => {
    return (
      <div>
        <br />
        <strong>
          <>
            <a href={info.Link} target="_blank" rel="noreferrer">
              {info.Scientific_name}
            </a>
          </>
        </strong>
        <br />
        {info.CommonName_EN && (
          <>
            {i18n.language !== "es" ? info.CommonName_EN : info.CommonName_ES}
            <br />
            <br />
          </>
        )}
      </div>
    );
  };

  const PlanNode = ({ info }) => {
    return (
      <div>
        <br />
        <strong>{info.Aim}</strong>
        <br />
        {info.Title_EN && (
          <>
            {i18n.language !== "es" ? info.Title_EN : info.Title_ES}
            <br />
            <br />
          </>
        )}
        {info.Plan_EN && (
          <>
            <a href={info["Plan link"]} target="_blank" rel="noreferrer">
              {i18n.language !== "es" ? info.Plan_EN : info.Plan_ES}
            </a>
            <br />
            <br />
          </>
        )}
      </div>
    );
  };

  return (
    <div
      id="infobox"
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
      ) : null}
      {node && nicknamesESSet.has(node.id) ? <ProjectNode info={node} /> : null}
      {node && orgCodeSet.has(node.id) ? <OrganizationNode info={node} /> : null}
      {node && scientificNameSet.has(node.id) ? <SpeciesNode info={node} /> : null}
      {node && aimSet.has(node.id) ? <PlanNode info={node} /> : null}
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
      selectedCategories: [],
      selectedThemes: [],
      selectedPolicyPlans: [],
      selectedThemesConnectedLinks: [],
      selectedThemesConnectedNodes: [],
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

  getConnectedLinks = (d, secondDegree) => {
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
    if (secondDegree) {
      data.links
        .filter(
          (link) =>
            connectedIDs.has(link.source.id) || connectedIDs.has(link.target.id)
        )
        .map((link) => {
          connectedIDs.add(link.source.id);
          connectedIDs.add(link.target.id);
          connectedLinks.add(link);
          return true;
        });
    }
    return [connectedIDs, connectedLinks];
  };

  getConnectedNodes = (connectedIDs) => {
    return data.nodes.filter((node) => connectedIDs.has(node.id));
  };

  setNodeSelection = (d) => {
    if (d === null) {
      this.setState({
        selectedNode: null,
        connectedNodes: null,
        connectedLinks: null,
      })
      return;
    }
    const { selectedNode } = this.state;
    // Map over all links to get lins of this node
    const [connectedIDs, connectedLinks] = this.getConnectedLinks(d, false);
    // Map over all nodes to get connected nodes by ID
    const connectedNodes = this.getConnectedNodes(connectedIDs);

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

  onCategoryClicked = (categoryColor) => {
    const { selectedCategories } = this.state;
    const indexOfCategory = selectedCategories.indexOf(categoryColor);
    this.setState({
      selectedCategories:
        indexOfCategory !== -1
          ? selectedCategories.filter((d, index) => index !== indexOfCategory)
          : selectedCategories.concat(categoryColor),
    });
  };

  onThemeClicked = (themeColor) => {
    const {
      selectedThemes,
      selectedThemesConnectedLinks,
      selectedThemesConnectedNodes,
    } = this.state;
    const indexOfTheme = selectedThemes.indexOf(themeColor);

    const themeNodes = data.nodes.filter((node) => {
      return node.color === themeColor;
    });

    let connectedLinks = [];
    let connectedNodes = [];

    // Map over all theme nodes
    themeNodes.map(themeNode => {
      // Map over all links to get lins of this node
      const [connectedIDs, cL] = this.getConnectedLinks(
        themeNode,
        false
      );
      connectedLinks = connectedLinks.concat(Array.from(cL));
      // Map over all nodes to get connected nodes by ID
      const cN = this.getConnectedNodes(connectedIDs);
      connectedNodes = connectedNodes.concat(cN);
      return true;
    })
    const t = [].concat(selectedThemesConnectedLinks);
    const n = [].concat(selectedThemesConnectedNodes);
    t.push(connectedLinks);
    n.push(connectedNodes);

    this.setState({
      selectedThemes:
        indexOfTheme !== -1
          ? selectedThemes.filter((d, index) => index !== indexOfTheme)
          : selectedThemes.concat(themeColor),
      selectedThemesConnectedLinks:
        indexOfTheme !== -1
          ? selectedThemesConnectedLinks.filter(
              (d, index) => index !== indexOfTheme
            )
          : t,
      selectedThemesConnectedNodes:
        indexOfTheme !== -1
          ? selectedThemesConnectedNodes.filter(
              (d, index) => index !== indexOfTheme
            )
          : n,
    });
  };

  onPolicyPlanClicked = (policyPlanColor) => {
    const { selectedPolicyPlans } = this.state;
    const indexOfPolicyPlan = selectedPolicyPlans.indexOf(policyPlanColor);
    this.setState({
      selectedPolicyPlans:
        indexOfPolicyPlan !== -1
          ? selectedPolicyPlans.filter(
              (d, index) => index !== indexOfPolicyPlan
            )
          : selectedPolicyPlans.concat(policyPlanColor),
    });
  };

  generateSVGBlob = (parent) => {
    let svgContent = parent.innerHTML;
    svgContent = svgContent.replace(
      /^[\s\S]*<svg/,
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

  onClickSaveNetwork = () => {
    const svgBlob = this.generateSVGBlob(this.refNetworkComponent.current);
    const url = window.URL.createObjectURL(svgBlob);
    var img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.getElementById("network-canvas");
      var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      window.URL.revokeObjectURL(svgBlob);
      canvas.toBlob((blob) => saveAs(blob, "rp-galapagos.png"), "image/png", 1);
    };
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
        selectedThemes: [],
        selectedCategories: [],
      });
      return;
    }

    if (tutorialIndex === -1) {
      this.setState({
        selectedCategories: [nodeCategories[1].color],
      });
    }
    if (tutorialIndex === 0) {
      this.setState({
        selectedCategories: [nodeCategories[1].color, nodeCategories[5].color],
      });
    }
    if (tutorialIndex === 1) {
      this.setState({
        selectedCategories: [nodeCategories[1].color],
        selectedThemes: [themes[8].color],
      });
    }
    if (tutorialIndex === 2) {
      this.setState({
        selectedCategories: [],
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
      selectedPolicyPlans,
      selectedThemesConnectedLinks,
      selectedThemesConnectedNodes,
      selectedCategories,
      searchText,
    } = this.state;
    // const markers = this.filterMarkers();

    return (
      <Grid container>
        <Grid item className="grid-item" xs={2} style={{ padding: 0 }}>
          <LeftLegend
            selectedThemes={selectedThemes}
            selectedCategories={selectedCategories}
            selectedPolicyPlans={selectedPolicyPlans}
            onThemeClicked={(themeColor) => this.onThemeClicked(themeColor)}
            onCategoryClicked={(categoryColor) =>
              this.onCategoryClicked(categoryColor)
            }
            onPolicyPlanClicked={(policyPlanColor) =>
              this.onPolicyPlanClicked(policyPlanColor)
            }
            onClickSaveNetwork={this.onClickSaveNetwork}
            openTheme={this.openOnDesktop(3)}
            openDownload={this.openOnDesktop(5)}
          />
        </Grid>
        {/* xs is sum of 12 */}
        <Grid item className="grid-item" xs={10} style={{ padding: 0 }}>
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
            selectedThemesConnectedLinks={selectedThemesConnectedLinks}
            selectedThemesConnectedNodes={selectedThemesConnectedNodes}
            selectedCategories={selectedCategories}
            selectedPolicyPlans={selectedPolicyPlans}
            searchText={searchText}
            onNodeClicked={(d, cb) => this.onNetworkClickNode(d, cb)}
          />
        </Grid>
        {/* <Grid item className="grid-item" xs={2} style={{ padding: 0 }}>
          <RightLegend />
        </Grid> */}

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
      selectedPolicyPlans,
      selectedThemesConnectedLinks,
      selectedThemesConnectedNodes,
      selectedCategories,
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
            selectedPolicyPlans={selectedPolicyPlans}
            selectedThemesConnectedLinks={selectedThemesConnectedLinks}
            selectedThemesConnectedNodes={selectedThemesConnectedNodes}
            selectedCategories={selectedCategories}
            searchText={searchText}
            onNodeClicked={(d, cb) => this.onNetworkClickNode(d, cb)}
          />
        </div>
        {tutorialOpen ? <MobileTutorial index={tutorialIndex} /> : null}
        <LeftLegend
          mobile
          selectedThemes={selectedThemes}
          selectedCategories={selectedCategories}
          selectedPolicyPlans={selectedPolicyPlans}
          onThemeClicked={(themeColor) => this.onThemeClicked(themeColor)}
          onCategoryClicked={(categoryColor) =>
            this.onCategoryClicked(categoryColor)
          }
          onPolicyPlanClicked={(policyPlanColor) =>
            this.onPolicyPlanClicked(policyPlanColor)
          }
          onClickSaveNetwork={this.onClickSaveNetwork}
          openTheme={this.openOnDesktop(3)}
          openDownload={this.openOnDesktop(5)}
        />
        {/* <RightLegend mobile iconClassName="sdg-icon-mobile" /> */}
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
