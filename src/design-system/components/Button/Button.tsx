'use client';

import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { radius } from '../../tokens/radius';
import { fontWeight, fontSize, lineHeight, fontFamily } from '../../tokens/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  sx?: SxProps<Theme>;
}

const SIZE_STYLES: Record<ButtonSize, Record<string, unknown>> = {
  sm: {
    height: `${spacing.s36}px`,
    paddingLeft: `${spacing.s12}px`,
    paddingRight: `${spacing.s12}px`,
    fontSize: `${fontSize.b3}px`,
    lineHeight: lineHeight.b3,
    fontWeight: fontWeight.semiBold,
  },
  md: {
    height: `${spacing.s44}px`,
    paddingLeft: `${spacing.s16}px`,
    paddingRight: `${spacing.s16}px`,
    fontSize: `${fontSize.t4}px`,
    lineHeight: lineHeight.t4,
    fontWeight: fontWeight.semiBold,
  },
  lg: {
    height: `${spacing.s52}px`,
    paddingLeft: `${spacing.s24}px`,
    paddingRight: `${spacing.s24}px`,
    fontSize: `${fontSize.t3}px`,
    lineHeight: lineHeight.t3,
    fontWeight: fontWeight.semiBold,
  },
};

const ICON_ONLY_SIZE_STYLES: Record<ButtonSize, Record<string, unknown>> = {
  sm: { width: `${spacing.s36}px`, height: `${spacing.s36}px`, padding: 0, minWidth: 0 },
  md: { width: `${spacing.s44}px`, height: `${spacing.s44}px`, padding: 0, minWidth: 0 },
  lg: { width: `${spacing.s52}px`, height: `${spacing.s52}px`, padding: 0, minWidth: 0 },
};

const VARIANT_SX: Record<ButtonVariant, Record<string, unknown>> = {
  primary: {
    backgroundColor: colors.primaryGold[300],
    color: colors.forestGreen[800],
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.primaryGold[400],
      boxShadow: 'none',
    },
    '&:active': {
      backgroundColor: colors.primaryGold[500],
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      backgroundColor: colors.neutral[400],
      color: colors.neutral[700],
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colors.primaryGold[300],
    border: `1.5px solid ${colors.primaryGold[300]}`,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.primaryGold[50],
      borderColor: colors.primaryGold[400],
      color: colors.primaryGold[400],
      boxShadow: 'none',
    },
    '&:active': {
      backgroundColor: colors.primaryGold[100],
      borderColor: colors.primaryGold[500],
      color: colors.primaryGold[500],
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      backgroundColor: 'transparent',
      borderColor: colors.neutral[500],
      color: colors.neutral[600],
    },
  },
  tertiary: {
    backgroundColor: 'transparent',
    color: colors.primaryGold[300],
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.primaryGold[50],
      color: colors.primaryGold[400],
      boxShadow: 'none',
    },
    '&:active': {
      backgroundColor: colors.primaryGold[100],
      color: colors.primaryGold[500],
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      backgroundColor: 'transparent',
      color: colors.neutral[600],
    },
  },
};

const SPINNER_SIZE: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const MUI_VARIANT_MAP: Record<ButtonVariant, 'contained' | 'outlined' | 'text'> = {
  primary: 'contained',
  secondary: 'outlined',
  tertiary: 'text',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconOnly = false,
      disabled,
      children,
      startIcon,
      endIcon,
      sx,
      ...rest
    },
    ref
  ) => {
    const spinnerSize = SPINNER_SIZE[size];

    return (
      <MuiButton
        ref={ref}
        variant={MUI_VARIANT_MAP[variant]}
        disabled={disabled || loading}
        disableElevation
        sx={{
          fontFamily: fontFamily.sans,
          borderRadius: `${radius.radius8}px`,
          position: 'relative',
          overflow: 'hidden',
          ...(iconOnly ? ICON_ONLY_SIZE_STYLES[size] : SIZE_STYLES[size]),
          ...VARIANT_SX[variant],
          ...sx,
        }}
        startIcon={!loading && !iconOnly ? startIcon : undefined}
        endIcon={!loading && !iconOnly ? endIcon : undefined}
        {...rest}
      >
        {loading && (
          <CircularProgress
            size={spinnerSize}
            color="inherit"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: `${-spinnerSize / 2}px`,
              marginLeft: `${-spinnerSize / 2}px`,
            }}
          />
        )}
        <Box
          component="span"
          sx={{
            visibility: loading ? 'hidden' : 'visible',
            display: 'flex',
            alignItems: 'center',
            gap: `${spacing.s8}px`,
          }}
        >
          {children}
        </Box>
      </MuiButton>
    );
  }
);

Button.displayName = 'DSButton';

export default Button;
