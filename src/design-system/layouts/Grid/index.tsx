'use client';

import React from 'react';
import MuiGrid, { GridProps } from '@mui/material/Grid';

export type { GridProps };

export const Grid = ({ children, ...rest }: GridProps) => {
  return <MuiGrid {...rest}>{children}</MuiGrid>;
};

export default Grid;
