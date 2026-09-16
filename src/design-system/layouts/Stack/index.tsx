'use client';

import React from 'react';
import MuiStack, { StackProps } from '@mui/material/Stack';

export type { StackProps };

export const Stack = ({ children, ...rest }: StackProps) => {
  return <MuiStack {...rest}>{children}</MuiStack>;
};

export default Stack;
