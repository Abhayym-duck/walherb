'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';
import { QuickPayBadge } from '../../payments/QuickPayBadge';

interface CheckoutActionsProps {
  onProceedToCheckout?: () => void;
  onQuickCheckout?: () => void;
  disabled?: boolean;
}

export const CheckoutActions = ({ onProceedToCheckout, onQuickCheckout, disabled }: CheckoutActionsProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Quick Checkout → Razorpay */}
      <Box
        component="button"
        onClick={() => { if (!disabled) onQuickCheckout?.(); }}
        disabled={disabled}
        sx={{
          width: '100%',
          backgroundColor: disabled ? '#CCCCCC' : '#1F322A',
          border: 'none',
          borderRadius: '12px',
          py: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          '&:hover:not(:disabled)': { backgroundColor: '#29433A' },
        }}
      >
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: '14px',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}>
          Quick Checkout
        </Typography>
        <QuickPayBadge />
      </Box>

      {/* Proceed To Checkout → full checkout page */}
      <Box
        component="button"
        onClick={() => { if (!disabled) onProceedToCheckout?.(); }}
        disabled={disabled}
        sx={{
          width: '100%',
          backgroundColor: disabled ? '#CCCCCC' : '#C8942A',
          border: 'none',
          borderRadius: '12px',
          py: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          '&:hover:not(:disabled)': { backgroundColor: '#B5821E' },
        }}
      >
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: '14px',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}>
          Proceed To Checkout
        </Typography>
      </Box>
    </Box>
  );
};

export default CheckoutActions;
