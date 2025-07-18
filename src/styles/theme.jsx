import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    corpico: {
      azul: '#3e64ac',
      violeta: '#712d85',
      rojo: '#e22b14',
      naranja: '#ea672e',
      amarillo: '#ffda1f',
      verde: '#35ac75',
      celeste: '#5fc3e6',
    },

    primary: {
      main: '#3e64ac',
      light: '#6d8dc2',
      dark: '#2c477a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#712d85',
      light: '#eb5a43',
      dark: '#a81f0d',
      contrastText: '#fff',
    },
    info: {
      main: '#5fc3e6',
      contrastText: '#000',
    },
    success: {
      main: '#35ac75',
      contrastText: '#fff',
    },
    warning: {
      main: '#ffda1f',
      contrastText: '#000',
    },
    error: {
      main: '#e22b14',
      contrastText: '#fff',
    },

    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
        },
        containedPrimary: {
          // Ya usa palette.primary.main
        },
        outlinedPrimary: {
          borderColor: '#3e64ac',
          '&:hover': {
            borderColor: '#3e64ac',
            backgroundColor: 'rgba(62, 100, 172, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // marginBottom: '16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#3e64ac', // Asegura que la AppBar use el color primario
        },
      },
    },
  },
});

export default theme;