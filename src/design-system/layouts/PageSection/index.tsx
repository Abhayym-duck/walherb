'use client';

import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { semanticSpacing } from '../../tokens/spacing';

export interface PageSectionProps extends Omit<BoxProps, 'component'> {
  as?: React.ElementType;
  verticalPadding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const VERTICAL_PADDING_MAP = {
  xs: `${semanticSpacing.sectionXs}px`,
  sm: `${semanticSpacing.sectionSm}px`,
  md: `${semanticSpacing.sectionMd}px`,
  lg: `${semanticSpacing.sectionLg}px`,
  xl: `${semanticSpacing.sectionXl}px`,
  xxl: `${semanticSpacing.sectionXxl}px`,
};

export const PageSection = ({
  as: Component = 'section',
  verticalPadding = 'md',
  children,
  sx,
  ...rest
}: PageSectionProps) => {
  const py = VERTICAL_PADDING_MAP[verticalPadding];

  return (
    <Box
      component={Component}
      sx={{
        width: '100%',
        paddingTop: { xs: VERTICAL_PADDING_MAP.xs, sm: VERTICAL_PADDING_MAP.sm, md: py },
        paddingBottom: { xs: VERTICAL_PADDING_MAP.xs, sm: VERTICAL_PADDING_MAP.sm, md: py },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default PageSection;
