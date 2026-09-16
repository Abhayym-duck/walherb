'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';

const NOTICE_BODY =
  'As per India Customs, all customers ordering internationally are required to complete KYC documents for customs clearance. The shipping information must be an exact match to the consignee\'s name and residential address. Failure to provide accurate KYC information may result in delivery delays or package rejection at customs.';

export const CartNotice = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{
      border: '1px solid #CFDAEB',
      borderRadius: '12px',
      p: '16px',
      backgroundColor: '#F2F7FF',
      display: 'flex',
      gap: '12px',
    }}>
      <InfoOutlinedIcon sx={{ fontSize: 20, color: '#41403B', flexShrink: 0, mt: '2px' }} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '16px',
            lineHeight: '22.4px',
            color: '#41403B',
          }}>
            Special Notice:
          </Typography>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '14px',
            lineHeight: '19.6px',
            color: '#41403B',
            ...(expanded ? {} : {
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }),
          }}>
            {NOTICE_BODY}
          </Typography>
        </Box>

        <Box
          component="button"
          onClick={() => setExpanded(v => !v)}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            p: 0,
            alignSelf: 'flex-start',
          }}
        >
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '14px',
            lineHeight: '19.6px',
            color: '#3371D5',
            textDecoration: 'underline',
          }}>
            {expanded ? 'Show less' : 'Show more'}
          </Typography>
          {expanded
            ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: '#3371D5' }} />
            : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#3371D5' }} />
          }
        </Box>
      </Box>
    </Box>
  );
};

export default CartNotice;
