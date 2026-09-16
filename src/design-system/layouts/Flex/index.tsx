'use client';

import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

export interface FlexProps extends Omit<BoxProps, 'display'> {
  direction?: React.CSSProperties['flexDirection'];
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: React.CSSProperties['flexWrap'];
  gap?: number | string;
  flex?: React.CSSProperties['flex'];
  inline?: boolean;
}

export const Flex = ({
  direction,
  align,
  justify,
  wrap,
  gap,
  flex,
  inline = false,
  children,
  sx,
  ...rest
}: FlexProps) => {
  return (
    <Box
      sx={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        gap,
        flex,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Flex;
