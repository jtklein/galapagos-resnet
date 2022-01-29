import Typography from "@material-ui/core/Typography";
import { isMobile } from "react-device-detect";

import DataComponent from "./components/DataComponent";

import "./App.css";

function App() {
  return (
    <div className="App">
      {isMobile ? (
        <Typography
          variant="h1"
          style={{
            borderTop: "1px solid #ccc",
            marginTop: -10,
            paddingTop: 10,
          }}
        >
          {"This website does not look good on mobile phones. Try it on a laptop or desktop computer instead."}
        </Typography>
      ) : (
        <DataComponent />
      )}
    </div>
  );
}

export default App;
