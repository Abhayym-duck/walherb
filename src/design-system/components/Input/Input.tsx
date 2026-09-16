'use client';

import React, { ReactNode, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { SxProps, Theme } from '@mui/material/styles';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { radius } from '../../tokens/radius';
import { fontWeight, fontSize, lineHeight, fontFamily } from '../../tokens/typography';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  readOnly?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  showPasswordToggle?: boolean;
  sx?: SxProps<Theme>;
}

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  (
    {
      label,
      placeholder,
      helperText,
      error,
      errorMessage,
      disabled,
      readOnly,
      startIcon,
      endIcon,
      showPasswordToggle,
      type,
      inputProps,
      InputProps: InputPropsOverride,
      sx,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password' || showPasswordToggle;
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const startAdornment = startIcon ? (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    ) : undefined;

    const endAdornment = isPassword ? (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          edge="end"
          tabIndex={-1}
          sx={{
            color: colors.neutral[700],
            padding: `${spacing.s8}px`,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          {showPassword ? (
            <VisibilityOff sx={{ fontSize: `${fontSize.t2}px` }} />
          ) : (
            <Visibility sx={{ fontSize: `${fontSize.t2}px` }} />
          )}
        </IconButton>
      </InputAdornment>
    ) : endIcon ? (
      <InputAdornment position="end">
        {endIcon}
      </InputAdornment>
    ) : undefined;

    return (
      <TextField
        ref={ref}
        variant="outlined"
        label={label}
        placeholder={placeholder}
        helperText={errorMessage || helperText}
        error={error}
        disabled={disabled}
        type={resolvedType}
        fullWidth
        InputProps={{
          readOnly,
          startAdornment,
          endAdornment,
          ...InputPropsOverride,
        }}
        inputProps={{
          ...inputProps,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: fontFamily.sans,
            fontSize: `${fontSize.t3}px`,
            lineHeight: lineHeight.t3,
            fontWeight: fontWeight.regular,
            borderRadius: `${radius.radius8}px`,
            backgroundColor: disabled ? colors.neutral[200] : colors.neutral[50],
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? '#D32F2F' : colors.neutral[400],
              borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: disabled
                ? colors.neutral[400]
                : error
                ? '#D32F2F'
                : colors.neutral[600],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? '#D32F2F' : colors.primaryGold[300],
              borderWidth: '1.5px',
            },
            '&.Mui-disabled': {
              backgroundColor: colors.neutral[200],
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.neutral[400],
              },
            },
          },
          '& .MuiInputBase-input': {
            padding: `${spacing.s12}px ${spacing.s16}px`,
            fontFamily: fontFamily.sans,
            fontSize: `${fontSize.t3}px`,
            lineHeight: lineHeight.t3,
            fontWeight: fontWeight.regular,
            color: colors.neutral[950],
            '&::placeholder': {
              color: colors.neutral[600],
              opacity: 1,
            },
            '&.Mui-disabled': {
              color: colors.neutral[600],
              WebkitTextFillColor: colors.neutral[600],
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: fontFamily.sans,
            fontSize: `${fontSize.t4}px`,
            lineHeight: lineHeight.t4,
            fontWeight: fontWeight.medium,
            color: colors.neutral[700],
            '&.Mui-focused': {
              color: error ? '#D32F2F' : colors.primaryGold[400],
            },
            '&.Mui-error': {
              color: '#D32F2F',
            },
            '&.Mui-disabled': {
              color: colors.neutral[600],
            },
          },
          '& .MuiFormHelperText-root': {
            fontFamily: fontFamily.sans,
            fontSize: `${fontSize.b3}px`,
            lineHeight: lineHeight.b3,
            fontWeight: fontWeight.regular,
            marginLeft: 0,
            marginTop: `${spacing.s4}px`,
          },
          '& .MuiInputAdornment-root': {
            color: error ? '#D32F2F' : colors.neutral[700],
          },
          ...sx,
        }}
        {...rest}
      />
    );
  }
);

Input.displayName = 'DSInput';

export default Input;
