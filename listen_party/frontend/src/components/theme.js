import { createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
  palette: {
    primary: {
          main: "#d1597b",
          contrastText:"rgba(0, 0, 0, 0.54)",
    },
    secondary: {
        main: "#ce6d5c",
        contrastText:"rgba(0, 0, 0, 0.54)",
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default theme; 