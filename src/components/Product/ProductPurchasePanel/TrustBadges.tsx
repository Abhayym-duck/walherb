'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';

export const TrustBadges = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {/* Buyer Protection */}
    <Box sx={{
      backgroundColor: '#EFFCF3',
      border: '1px solid #DBFAE5',
      borderRadius: '12px',
      p: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <Box sx={{
        backgroundColor: '#29713C',
        borderRadius: '8px',
        p: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <CheckIcon sx={{ fontSize: 12, color: '#FFFFFF' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.bold,
          fontSize: '12px',
          lineHeight: '15.6px',
          color: '#433C50',
        }}>
          Buyer Protection
        </Typography>
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: '10px',
          lineHeight: '13px',
          color: '#6D6777',
        }}>
          Full refund if your order doesn&apos;t arrive as described.
        </Typography>
      </Box>
    </Box>

    {/* Walherb Quality Promise */}
    <Box sx={{
      backgroundColor: '#FFFCF7',
      border: '1px solid #FFEAC6',
      borderRadius: '12px',
      p: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      <Box sx={{
        backgroundColor: '#D5A310',
        borderRadius: '8px',
        p: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <CheckIcon sx={{ fontSize: 12, color: '#FFFFFF' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.bold,
            fontSize: '12px',
            lineHeight: '15.6px',
            color: '#433C50',
          }}>
            Walherb Quality Promise
          </Typography>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '10px',
            lineHeight: '13px',
            color: '#6D6777',
          }}>
            This product is guaranteed authentic and backed by our easy returns and refunds policy.
          </Typography>
        </Box>
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semiBold,
          fontSize: '10px',
          lineHeight: '13px',
          color: '#6D6777',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}>
          Details
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default TrustBadges;
