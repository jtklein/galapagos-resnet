import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

import TitlePanel from "./components/TitlePanel";
import DataComponent from "./components/DataComponent";
import Explanation from "./Explanation";

import "./App.css";

function App() {
  const { t } = useTranslation();
  return (
    <div className="App">
      <TitlePanel />

      {isMobile ? (
        <Typography
          variant="h1"
          style={{
            borderTop: "1px solid #ccc",
            marginTop: -10,
            paddingTop: 10,
          }}
        >
          {
            "This website does not look good on mobile phones. Try it on a laptop or desktop computer instead."
          }
        </Typography>
      ) : (
        <Grid container>
          {isMobile ? (
            <Grid item className="grid-item section section-0" xs={12}>
              <Typography variant="h5" gutterBottom style={{ color: "#666" }}>
                {t("subtitle")}
              </Typography>
            </Grid>
          ) : null}
          <Grid item className="grid-item section section-1" xs={12}>
            <DataComponent />
          </Grid>
          <Grid item className="grid-item section section-2" xs={12}>
            <Explanation />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default App;
