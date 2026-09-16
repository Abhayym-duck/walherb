'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../../../design-system/tokens/typography';

interface QuantitySelectorProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) => {
  const canDec = !disabled && value > min;
  const canInc = !disabled && value < max;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', pl: '4px' }}>
      <Typography sx={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.medium,
        fontSize: `${fontSize.t3}px`,
        color: '#777474',
        whiteSpace: 'nowrap',
      }}>
        Quantity
      </Typography>
      <Box sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EBE8E4',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        px: '8px',
        py: '4px',
        gap: '8px',
      }}>
        <Box
          component="button"
          onClick={() => canDec && onChange(value - 1)}
          disabled={!canDec}
          aria-label="Decrease quantity"
          sx={{
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', backgroundColor: 'transparent',
            cursor: canDec ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            opacity: canDec ? 1 : 0.35,
            '&:hover:not(:disabled)': { backgroundColor: '#F0F0F0' },
          }}
        >
          <RemoveIcon sx={{ fontSize: 14, color: '#686E6B' }} />
        </Box>
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: `${fontSize.t3}px`,
          color: '#686E6B',
          minWidth: 24,
          textAlign: 'center',
        }}>
          {value}
        </Typography>
        <Box
          component="button"
          onClick={() => canInc && onChange(value + 1)}
          disabled={!canInc}
          aria-label="Increase quantity"
          sx={{
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', backgroundColor: 'transparent',
            cursor: canInc ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            opacity: canInc ? 1 : 0.35,
            '&:hover:not(:disabled)': { backgroundColor: '#F0F0F0' },
          }}
        >
          <AddIcon sx={{ fontSize: 14, color: '#686E6B' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default QuantitySelector;
