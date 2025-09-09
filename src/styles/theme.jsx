import { createTheme } from '@mui/material/styles';

export const corpicoPalette = {
  azul: '#3e64ac',
  violeta: '#712d85',
  rojo: '#e22b14',
  naranja: '#ea672e',
  amarillo: '#ffda1f',
  verde: '#35ac75',
  celeste: '#5fc3e6',
};

// Función para obtener la paleta de colores de texto y fondo según el modo
const getDynamicPalette = (mode) => {
  if (mode === 'dark') {
    return {
      background: {
        default: '#121212',
        main: '#212121',
        paper: '#1e1e1e',
        layout: 'rgba(31, 31, 31, 1)',
      },
      text: {
        primary: 'rgba(255, 255, 255, 0.87)',
        secondary: 'rgba(255, 255, 255, 0.6)',
        third: 'rgba(255, 255, 255, 1)',
        disabled: 'rgba(255, 255, 255, 0.38)',
      },
    };
  } else {
    return {
      background: {
        default: '#e0e0e0',
        main: '#f0f2f5',
        paper: '#ffffff',
        layout: 'rgba(31, 31, 31, 1)',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        third: 'rgba(31, 31, 31, 1)',
        disabled: 'rgba(0, 0, 0, 0.38)',
      },
    };
  }
};

const appTheme = (mode) => createTheme({
  palette: {
    mode,
    corpico: corpicoPalette,
    ...getDynamicPalette(mode),

    primary: {
      main: corpicoPalette.azul,
      light: '#6d8dc2',
      dark: '#2c477a',
      contrastText: '#fff',
    },
    secondary: {
      main: corpicoPalette.violeta,
      light: '#975a9e',
      dark: '#581f69',
      contrastText: '#fff',
    },
    info: {
      main: corpicoPalette.celeste,
      contrastText: '#000',
    },
    success: {
      main: corpicoPalette.verde,
      contrastText: '#fff',
      light: '#60c996',
      dark: '#2a8256',
    },
    warning: {
      main: corpicoPalette.amarillo,
      contrastText: '#000',
      light: '#ffe957',
      dark: '#ccb018',
    },
    error: {
      main: corpicoPalette.rojo,
      contrastText: '#fff',
      light: '#e85a4a',
      dark: '#b32010',
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
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
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
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `linear-gradient(60deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, .14), 0 7px 10px -5px rgba(156, 39, 176, .4)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '20px',
          boxShadow: '0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12)',
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.grey[900],
          wordWrap: 'break-word',
          backgroundClip: 'border-box',
          border: `1px solid ${theme.palette.grey[300]}`,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          position: 'relative',
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
          borderColor: theme.palette.success.main,
        }),
        icon: ({ theme }) => ({
          color: `${theme.palette.success.contrastText} !important`,
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
        },
        containedPrimary: {
          // Ya usa palette.primary.main por defecto
        },
        outlinedPrimary: ({ theme }) => ({
          borderColor: theme.palette.corpico.azul,
          '&:hover': {
            borderColor: theme.palette.corpico.azul,
            backgroundColor: 'rgba(62, 100, 172, 0.04)',
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Estilos globales para todos los TextField
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
        colorPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.corpico.azul,
        }),
      },
    },
  },
});

export default appTheme;