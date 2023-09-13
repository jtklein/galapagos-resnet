import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

// Following the styling of https://co-galapagos.org/ the font for the headers is Mada
// As first fallback:
// According to https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/01/SDG_Guidelines_AUG_2019_Final.pdf:
// ROBOTO font is usually used for body copy and additional information.
const bodyFonts = ["Mada", "Roboto", '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"].join(",");

// Following the styling of https://co-galapagos.org/ the font for the headers is Marmelad
// As first fallback:
// According to https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/01/SDG_Guidelines_AUG_2019_Final.pdf:
// OSWALD font is usually used for headline and titles.
const hFonts = ["Marmelad", "Oswald", "Roboto", '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"].join(
  ","
);

const themeConfig = {
  typography: {
    fontSize: 16,
    fontFamily: bodyFonts,
    h1: {
      fontFamily: hFonts,
    },
    h2: {
      fontFamily: hFonts,
    },
    h3: {
      fontFamily: hFonts,
    },
    h4: {
      fontFamily: hFonts,
    },
    h5: {
      fontFamily: hFonts,
    },
    h6: {
      fontFamily: hFonts,
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
