import { createTheme } from '@mui/material/styles';
import { colors } from './tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from './tokens/typography';
import { radius } from './tokens/radius';

export const theme = createTheme({
  palette: {
    primary: {
      light: colors.primaryGold[200],
      main: colors.primaryGold[300],
      dark: colors.primaryGold[500],
      contrastText: colors.forestGreen[800],
    },
    success: {
      light: colors.successGreen[100],
      main: colors.successGreen[400],
      dark: colors.successGreen[600],
      contrastText: colors.neutral[50],
    },
    background: {
      default: colors.neutral[100],
      paper: colors.neutral[50],
    },
    text: {
      primary: colors.neutral[950],
      secondary: colors.slate[500],
      disabled: colors.neutral[600],
    },
    divider: colors.neutral[300],
    error: {
      main: '#D32F2F',
    },
  },
  typography: {
    fontFamily: fontFamily.sans,
    h1: {
      fontSize: `${fontSize.displayLarge}px`,
      lineHeight: lineHeight.displayLarge,
      fontWeight: fontWeight.bold,
    },
    h2: {
      fontSize: `${fontSize.displayMedium}px`,
      lineHeight: lineHeight.displayMedium,
      fontWeight: fontWeight.bold,
    },
    h3: {
      fontSize: `${fontSize.displaySmall}px`,
      lineHeight: lineHeight.displaySmall,
      fontWeight: fontWeight.bold,
    },
    h4: {
      fontSize: `${fontSize.t1}px`,
      lineHeight: lineHeight.t1,
      fontWeight: fontWeight.bold,
    },
    h5: {
      fontSize: `${fontSize.t2}px`,
      lineHeight: lineHeight.t2,
      fontWeight: fontWeight.bold,
    },
    h6: {
      fontSize: `${fontSize.t3}px`,
      lineHeight: lineHeight.t3,
      fontWeight: fontWeight.bold,
    },
    subtitle1: {
      fontSize: `${fontSize.t1}px`,
      lineHeight: lineHeight.t1,
      fontWeight: fontWeight.medium,
    },
    subtitle2: {
      fontSize: `${fontSize.t2}px`,
      lineHeight: lineHeight.t2,
      fontWeight: fontWeight.medium,
    },
    body1: {
      fontSize: `${fontSize.b1}px`,
      lineHeight: lineHeight.b1,
      fontWeight: fontWeight.regular,
    },
    body2: {
      fontSize: `${fontSize.b2}px`,
      lineHeight: lineHeight.b2,
      fontWeight: fontWeight.regular,
    },
    caption: {
      fontSize: `${fontSize.b3}px`,
      lineHeight: lineHeight.b3,
      fontWeight: fontWeight.regular,
    },
    overline: {
      fontSize: `${fontSize.b4}px`,
      lineHeight: lineHeight.b4,
      fontWeight: fontWeight.regular,
      textTransform: 'none',
    },
    button: {
      fontSize: `${fontSize.t4}px`,
      lineHeight: lineHeight.t4,
      fontWeight: fontWeight.semiBold,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: radius.radius8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: {
          fontFamily: fontFamily.sans,
          color: colors.neutral[950],
          backgroundColor: colors.neutral[100],
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: `${radius.radius8}px`,
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semiBold,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
          '&:focus-visible': { boxShadow: 'none' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: `${radius.radius8}px`,
          fontFamily: fontFamily.sans,
          backgroundColor: colors.neutral[50],
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.neutral[400],
            borderWidth: 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.neutral[600],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primaryGold[300],
            borderWidth: '1.5px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D32F2F',
          },
          '&.Mui-disabled': {
            backgroundColor: colors.neutral[200],
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.neutral[400],
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: fontFamily.sans,
          fontSize: `${fontSize.t4}px`,
          lineHeight: lineHeight.t4,
          fontWeight: fontWeight.medium,
          color: colors.neutral[700],
          '&.Mui-focused': {
            color: colors.primaryGold[400],
          },
          '&.Mui-error': {
            color: '#D32F2F',
          },
          '&.Mui-disabled': {
            color: colors.neutral[600],
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: fontFamily.sans,
          fontSize: `${fontSize.b3}px`,
          lineHeight: lineHeight.b3,
          fontWeight: fontWeight.regular,
          marginLeft: 0,
          marginTop: '4px',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: colors.neutral[700],
        },
      },
    },
  },
});

export default theme;
