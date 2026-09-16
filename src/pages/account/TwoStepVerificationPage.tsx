'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

// ─── Shared input style ───────────────────────────────────────────────────────

const READONLY_INPUT_SX = {
  width: '100%',
  border: '1px solid #D9D9D9',
  borderRadius: '12px',
  px: '12px',
  py: '12px',
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.regular,
  fontSize: '16px',
  lineHeight: '22.4px',
  color: '#6D6777',
  outline: 'none',
  backgroundColor: '#F8F6F6',
  cursor: 'not-allowed',
  boxSizing: 'border-box' as const,
} as const;

// ─── Custom toggle (matches Figma knob/track dimensions) ──────────────────────

const TOGGLE_SX = {
  width: 52,
  height: 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '3px',
    transitionDuration: '220ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#FFFFFF',
      '& + .MuiSwitch-track': {
        backgroundColor: '#476D59',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.22)',
    backgroundColor: '#FFFFFF',
  },
  '& .MuiSwitch-track': {
    borderRadius: 500,
    backgroundColor: '#EAEAEC',
    boxShadow: 'inset 0px 0px 4px 0px rgba(0,0,0,0.16)',
    opacity: 1,
  },
} as const;

// ─── TwoStepVerificationPage ──────────────────────────────────────────────────

export const TwoStepVerificationPage = () => {
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title + headline description */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '22px',
            lineHeight: '28.6px',
            color: '#474743',
          }}
        >
          2-Step Verification
        </Typography>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '16px',
            lineHeight: '22.4px',
            color: '#474743',
          }}
        >
          {enabled
            ? '2-Step Verification is enabled. You\'ll receive a verification code at the email below when signing in.'
            : "You won't receive verification codes when you sign in. To improve your account's security, turn on 2-Step Verification."}
        </Typography>
      </Box>

      {/* Toggle + email + footer */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Toggle row + sub-description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Switch
            checked={enabled}
            onChange={(e) => { setEnabled(e.target.checked); setSaved(false); }}
            disableRipple
            sx={TOGGLE_SX}
          />
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: '16px',
              lineHeight: '22.4px',
              color: '#474743',
            }}
          >
            To receive your verification code, please ensure you have access to the email below. You can edit it on your &ldquo;Account Information&rdquo; page.
          </Typography>
        </Box>

        {/* Email field */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', maxWidth: 459 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#433C50',
                flex: 1,
              }}
            >
              Email
            </Typography>
            <Box
              role="button"
              tabIndex={0}
              aria-label="Edit email on Account Information page"
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.7 } }}
            >
              <EditIcon sx={{ fontSize: 16, color: '#433C50' }} />
            </Box>
          </Box>
          <Box
            component="input"
            readOnly
            value="kaushal@outlook.com"
            sx={READONLY_INPUT_SX}
          />
        </Box>

        {/* Footer row */}
        <Box
          sx={{
            borderTop: '1px solid #E3E6EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: '16px',
          }}
        >
          <Box
            role="button"
            tabIndex={0}
            onClick={handleSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            sx={{
              backgroundColor: '#1F322A',
              borderRadius: '12px',
              px: '32px',
              py: '12px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#162319' },
            }}
          >
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '16px',
                lineHeight: '20.8px',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              Save
            </Typography>
          </Box>
        </Box>

        {/* Success toast */}
        {saved && (
          <Box
            sx={{
              backgroundColor: '#E8F5E9',
              border: '1px solid #476D59',
              borderRadius: '8px',
              px: '16px',
              py: '10px',
              maxWidth: 459,
            }}
          >
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '14px',
                color: '#2E7D32',
              }}
            >
              {enabled ? '2-Step Verification enabled.' : '2-Step Verification disabled.'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TwoStepVerificationPage;
