import { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#FE8266",
    },
    background: {
      paper: "#fff3f0",
    },
    text: {
      primary: "#1a0601",
      secondary: "#4a2a24",
    },
    secondary: {
      main: "#f9bd3a",
    },
  },
  typography: {
    fontFamily:
      '"Architects Daughter", "Architects Daughter", system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily:
            '"Architects Daughter", "Architects Daughter", system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
      },
    },
  },
};

export const Theme = createTheme(themeOptions);
