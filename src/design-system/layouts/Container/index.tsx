'use client';

import React from 'react';
import MuiContainer, { ContainerProps } from '@mui/material/Container';
import { semanticSpacing } from '../../tokens/spacing';

export interface DSContainerProps extends ContainerProps {
  noPadding?: boolean;
}

export const Container = ({ noPadding = false, children, sx, ...rest }: DSContainerProps) => {
  return (
    <MuiContainer
      maxWidth="lg"
      sx={{
        paddingLeft: noPadding
          ? 0
          : {
              xs: `${semanticSpacing.pageMobile}px`,
              sm: `${semanticSpacing.pageTablet}px`,
              md: `${semanticSpacing.pageDesktop}px`,
            },
        paddingRight: noPadding
          ? 0
          : {
              xs: `${semanticSpacing.pageMobile}px`,
              sm: `${semanticSpacing.pageTablet}px`,
              md: `${semanticSpacing.pageDesktop}px`,
            },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiContainer>
  );
};

export default Container;
