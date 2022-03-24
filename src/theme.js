import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const fontsFallback = [
  "Roboto",
  '"Helvetica Neue"',
  "Helvetica",
  "Arial",
  "sans-serif",
].join(",");

const themeConfig = {
  typography: {
    fontSize: 16,
    fontFamily: fontsFallback,
    h1: {
      fontFamily: fontsFallback,
    },
    h2: {
      fontFamily: fontsFallback,
    },
    h3: {
      fontFamily: fontsFallback,
    },
    h4: {
      fontFamily: fontsFallback,
    },
    h5: {
      fontFamily: fontsFallback,
    },
    h6: {
      fontFamily: fontsFallback,
    },
  },
  palette: {
    // Colors taken from https://co-galapagos.org/
    primary: {
      main: "#d1f9d6",
      contrastText: "#1b4332",
    },
    secondary: {
      main: "#1b4332",
      contrastText: "#d1f9d6",
    },
  },
};

const defaultTheme = responsiveFontSizes(createTheme(themeConfig));

const theme = {
  ...defaultTheme,
  overrides: {
    MuiTypography: {
      h5: {
        "@media (max-width:1150px)": {
          fontSize: "1.25rem",
        },
        "@media (max-width:900px)": {
          fontSize: "1rem",
        },
      },
      subtitle2: {
        "@media (max-width:1150px)": {
          fontSize: "0.9rem",
        },
        "@media (max-width:900px)": {
          fontSize: "0.8rem",
        },
        "@media (max-width:800px)": {
          fontSize: "0.7rem",
        },
      },
    },
  },
};

export default theme;
