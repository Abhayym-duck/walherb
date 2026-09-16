'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';
import { walherb } from '../../../design-system/tokens/colors';

export const PromoCode = () => {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!code.trim()) { setError('Enter a promo code'); return; }
    setError('');
    // Placeholder — promo validation would go here
    setApplied(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography sx={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semiBold,
        fontSize: '14px',
        color: '#3E3C42',
      }}>
        Promo Code
      </Typography>

      <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <TextField
          placeholder="Enter Code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(''); setApplied(false); }}
          error={!!error}
          helperText={error || (applied ? '✓ Code applied!' : undefined)}
          size="small"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontFamily: fontFamily.sans,
              fontSize: '14px',
              backgroundColor: '#FFFFFF',
              '& fieldset': { borderColor: '#E3E3E3' },
              '&:hover fieldset': { borderColor: walherb.greenPrimary },
              '&.Mui-focused fieldset': { borderColor: walherb.greenPrimary },
            },
            '& .MuiFormHelperText-root': {
              fontFamily: fontFamily.sans,
              fontSize: '11px',
              color: applied ? '#29713C' : undefined,
            },
          }}
        />
        <Box
          component="button"
          onClick={handleApply}
          sx={{
            height: 40,
            px: '20px',
            backgroundColor: '#1F322A',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '14px',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            '&:hover': { backgroundColor: '#29433A' },
          }}
        >
          Apply
        </Box>
      </Box>
    </Box>
  );
};

export default PromoCode;
