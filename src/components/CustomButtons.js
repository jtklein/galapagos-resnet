
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export const CustomButtonGreen = withStyles((theme) => ({
  root: {
    fontSize: "0.9em",
    color: theme.palette.primary.contrastText,
  },
}))(Button);
