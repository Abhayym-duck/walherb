'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamily, fontWeight, fontSize } from '../../../design-system/tokens/typography';

// Figma CDN assets — valid 7 days from generation
const SECURE_PAY_ICONS: { src: string; alt: string; w: number }[] = [
  { src: 'https://www.figma.com/api/mcp/asset/b90b3380-b3eb-4213-a5ba-1861875dfaa1', alt: 'Visa',       w: 37 },
  { src: 'https://www.figma.com/api/mcp/asset/d2191ccb-0e43-4673-a277-48c8c0e43064', alt: 'Mastercard', w: 27 },
  { src: 'https://www.figma.com/api/mcp/asset/a9f896fb-71fe-4fc6-b423-9a6285280669', alt: 'Google Pay', w: 30 },
  { src: 'https://www.figma.com/api/mcp/asset/49988f2d-9662-44f3-a578-00d4a3445da0', alt: 'Apple Pay',  w: 37 },
  { src: 'https://www.figma.com/api/mcp/asset/c5de655b-eb91-4fbb-94a9-62c9b43a67c5', alt: 'UPI',        w: 51 },
];

export const PaymentMethods = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Typography sx={{
      fontFamily: fontFamily.sans,
      fontWeight: fontWeight.bold,
      fontSize: `${fontSize.t4}px`,
      lineHeight: 'normal',
      color: '#433C50',
    }}>
      Secure Payment
    </Typography>
    <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {SECURE_PAY_ICONS.map((pm) => (
        <Box
          key={pm.alt}
          sx={{
            border: '1px solid #EBE8E4',
            borderRadius: '8px',
            p: '8px',
            width: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={pm.src}
            alt={pm.alt}
            sx={{ width: pm.w, height: 12, objectFit: 'contain' }}
          />
        </Box>
      ))}
    </Box>
  </Box>
);

export default PaymentMethods;
