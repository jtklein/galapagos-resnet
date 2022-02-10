import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { useTranslation } from 'react-i18next';

import Team from "./components/Team";
import Data from "./components/Data";

import "./Explanation.css";

const TheTabs = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
}))(Tabs);

function Explanation() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const { t } = useTranslation();
  return (
    <div>
      <TheTabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="fullWidth"
        aria-label="full width tabs example"
        centered
      >
        <Tab label={<h3 id="Summary">{t("Summary")}</h3>} />
        <Tab label={<h3 id="Data">{t("Data")}</h3>} />
        <Tab label={<h3 id="Team">{t("Team")}</h3>} />
      </TheTabs>
      <SwipeableViews
        axis={"x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        animateHeight
      >
        {/* First tab */}
        <div className="tab-panel" value={value} index={0}>
          The summary text goes here
        </div>
        {/* Second tab */}
        <div className="tab-panel" value={value} index={1}>
          <Data />
        </div>
        {/* Third tab */}
        <div className="tab-panel" value={value} index={2}>
          <Team />
        </div>
      </SwipeableViews>
    </div>
  );
}

export default Explanation;
