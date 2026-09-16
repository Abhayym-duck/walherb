'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';

type EstimatorState = 'idle' | 'open' | 'confirmed';

interface DeliveryResult {
  earliest: string;
  latest: string;
  pincode: string;
}

function calcDeliveryEstimate(pincode: string): { earliest: string; latest: string } {
  const metroFirst = ['1', '2', '4', '6', '7', '8'];
  const isMetro = metroFirst.includes(pincode[0] ?? '');
  const minDays = isMetro ? 7 : 10;
  const maxDays = isMetro ? 9 : 12;
  const base = new Date();
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const earliest = new Date(base);
  earliest.setDate(base.getDate() + minDays);
  const latest = new Date(base);
  latest.setDate(base.getDate() + maxDays);
  return { earliest: fmt(earliest), latest: fmt(latest) };
}

interface DeliveryEstimatorProps {
  shipsFrom?: string;
  partner?: string;
}

export const DeliveryEstimator = ({
  shipsFrom = 'USA',
  partner = 'Shadowfax Delhivery',
}: DeliveryEstimatorProps) => {
  const [state, setState] = useState<EstimatorState>('idle');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [confirmed, setConfirmed] = useState<DeliveryResult | null>(null);

  const defaultEst = (() => {
    const base = new Date();
    const fmt = (d: Date) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const e = new Date(base); e.setDate(base.getDate() + 10);
    const l = new Date(base); l.setDate(base.getDate() + 12);
    return `${fmt(e)}–${fmt(l)}`;
  })();

  const handleApply = () => {
    if (!/^\d{6}$/.test(pinInput)) {
      setPinError('Enter a valid 6-digit pincode');
      return;
    }
    setPinError('');
    const est = calcDeliveryEstimate(pinInput);
    setConfirmed({ ...est, pincode: pinInput });
    setState('confirmed');
    setPinInput('');
  };

  const handleClose = () => {
    setState('idle');
    setPinInput('');
    setPinError('');
  };

  const deliveryLabel = confirmed
    ? `${confirmed.earliest}–${confirmed.latest} to India`
    : `${defaultEst} to India`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Delivery date row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Box sx={{
          backgroundColor: '#F9F6F4',
          borderRadius: '8px',
          p: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <LocalShippingIcon sx={{ fontSize: 16, color: '#433C50' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Typography sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.bold,
              fontSize: '12px',
              lineHeight: '15.6px',
              color: '#433C50',
            }}>
              Free Delivery {deliveryLabel}
            </Typography>
            {state === 'confirmed' && (
              <Box
                component="button"
                onClick={() => setState('open')}
                aria-label="Edit delivery pincode"
                sx={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  p: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  '&:hover': { backgroundColor: '#F0F0F0' },
                }}
              >
                <EditIcon sx={{ fontSize: 12, color: '#6D6777' }} />
              </Box>
            )}
          </Box>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '10px',
            lineHeight: '13px',
            color: '#6D6777',
          }}>
            Shipped from {shipsFrom} — {partner}
          </Typography>
        </Box>
      </Box>

      {/* Idle: "Get Delivery Estimates" button */}
      {state === 'idle' && (
        <Box
          component="button"
          onClick={() => setState('open')}
          sx={{
            backgroundColor: '#E8EFEC',
            borderRadius: '50px',
            px: '8px',
            py: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            alignSelf: 'flex-start',
            cursor: 'pointer',
            border: 'none',
            '&:hover': { backgroundColor: '#D8E8E0' },
          }}
        >
          <LocationOnIcon sx={{ fontSize: 12, color: '#433C50' }} />
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '10px',
            color: '#433C50',
            whiteSpace: 'nowrap',
          }}>
            Get Delivery Estimates
          </Typography>
        </Box>
      )}

      {/* Open / entered: postal code input */}
      {(state === 'open') && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: '12px',
            color: '#433C50',
          }}>
            Enter your postal code
          </Typography>
          <TextField
            autoFocus
            placeholder="eg. 100011"
            value={pinInput}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPinInput(v);
              if (pinError) setPinError('');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
            error={!!pinError}
            helperText={pinError || undefined}
            inputProps={{ maxLength: 6, inputMode: 'numeric' }}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontFamily: fontFamily.sans,
                fontSize: '14px',
                fontWeight: fontWeight.medium,
                letterSpacing: '2px',
                backgroundColor: '#FFFFFF',
                '& fieldset': { borderColor: '#E6E6E6' },
                '&:hover fieldset': { borderColor: walherb.greenPrimary },
                '&.Mui-focused fieldset': { borderColor: walherb.greenPrimary },
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Box
              component="button"
              onClick={handleClose}
              sx={{
                flex: 1,
                border: '1px solid #E6E6E6',
                borderRadius: '10px',
                py: '10px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '14px',
                color: '#433C50',
                '&:hover': { backgroundColor: '#F5F5F5' },
              }}
            >
              Close
            </Box>
            <Box
              component="button"
              onClick={handleApply}
              sx={{
                flex: 2,
                border: 'none',
                borderRadius: '10px',
                py: '10px',
                backgroundColor: '#1F322A',
                cursor: 'pointer',
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: '14px',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#29433A' },
              }}
            >
              Apply
            </Box>
          </Box>
        </Box>
      )}

      {/* Confirmed: change pincode link */}
      {state === 'confirmed' && confirmed && (
        <Box
          component="button"
          onClick={() => setState('open')}
          sx={{
            backgroundColor: '#E8EFEC',
            borderRadius: '50px',
            px: '8px',
            py: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            alignSelf: 'flex-start',
            cursor: 'pointer',
            border: 'none',
            '&:hover': { backgroundColor: '#D8E8E0' },
          }}
        >
          <LocationOnIcon sx={{ fontSize: 12, color: '#433C50' }} />
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '10px',
            color: '#433C50',
            whiteSpace: 'nowrap',
          }}>
            Change pincode ({confirmed.pincode})
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DeliveryEstimator;
