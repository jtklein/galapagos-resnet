import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useTranslation, Trans } from "react-i18next";
import { isMobile } from "react-device-detect";

import logo from "../logo.png";

const Logo = ({ className, alt }) => (
  <img src={logo} className={className} alt={alt} />
);

const TitlePanel = () => {
    const { t, i18n } = useTranslation();
    return (
      <AppBar color="primary" position="static" className="AppBar">
        <Toolbar variant="dense">
          {i18n.language !== "es" ? (
            <Button
              color="inherit"
              onClick={() => {
                i18n.changeLanguage("es");
              }}
            >
              En español
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                i18n.changeLanguage("en");
              }}
            >
              In English
            </Button>
          )}
          <div
            style={{
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Typography variant="h5" gutterBottom style={{ flexGrow: 1 }}>
              <Trans i18nKey="title">
                An interactive tool to explore the
                <strong>Sustainable Development Goals</strong> in{" "}
                <strong>Galápagos</strong>
              </Trans>
            </Typography>
            {!isMobile ? (
              <Typography
                variant="subtitle2"
                style={{
                  borderTop: "1px solid #ccc",
                  marginTop: -10,
                  paddingTop: 10,
                }}
              >
                {t("subtitle")}
              </Typography>
            ) : null}
          </div>
          <Logo className="appbar-logo" alt="appbar-logo" />
        </Toolbar>
      </AppBar>
    );
}
 
export default TitlePanel;