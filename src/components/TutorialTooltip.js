import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import Close from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import { isDesktop } from "react-device-detect";

import { Grid } from "@material-ui/core";

const onMobile = !isDesktop || window.innerWidth < 800;

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.secondary.main,
    color: "rgba(255, 255, 255, 0.87)",
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #000000",
    pointerEvents: "auto",
  },
}))(Tooltip);

const TutorialTooltip = ({
  children,
  title,
  description,
  placement,
  open,
  index,
  onSlideChange,
  firstSlide,
  lastSlide,
  mobile,
}) => {
  const { i18n } = useTranslation();

  const ofElements = "/12";

  const titleElement = (
    <React.Fragment>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <IconButton color="inherit" onClick={() => onSlideChange(false, true)}>
          <Close fontSize="small" className="clickable" />
        </IconButton>
      </div>
      <Typography color="inherit" align="center" style={{ marginTop: 8 }}>
        {i18n.t(title)}
      </Typography>
      <div>{i18n.t(description)}</div>
      <br />
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          {firstSlide ? (
            <IconButton color="inherit" disabled>
              <ArrowBack fontSize="small" />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => onSlideChange(true)}>
              <ArrowBack fontSize="small" className="clickable" />
            </IconButton>
          )}
        </Grid>
        <Grid item>
          <div>{index + 1 + ofElements}</div>
        </Grid>
        <Grid item>
          {lastSlide ? (
            <IconButton color="inherit" disabled>
              <ArrowForward fontSize="small" />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => onSlideChange()}>
              <ArrowForward fontSize="small" className="clickable" />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );

  return (
    <HtmlTooltip
      title={titleElement}
      placement={placement}
      open={open}
      arrow={!onMobile}
    >
      {children}
    </HtmlTooltip>
  );
};

export default TutorialTooltip;
