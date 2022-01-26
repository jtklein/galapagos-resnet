import Grid from "@material-ui/core/Grid";

import DataComponent from "./components/DataComponent";
// import Explanation from "./Explanation";

import "./App.css";


function App() {
  return (
    <div className="App">
      <Grid container>
        <Grid item className="grid-item section section-0" xs={12}>
          <DataComponent />
        </Grid>
        <Grid item className="grid-item section section-1" xs={12}>
          {/* <Explanation /> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
