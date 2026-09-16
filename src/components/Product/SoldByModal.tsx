'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Grow from '@mui/material/Grow';
import CloseIcon from '@mui/icons-material/Close';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

const PARAGRAPHS = [
  'Walherb sources this product from trusted international suppliers on your behalf.',
  'Products may be fulfilled directly from the listed seller or from equivalent authorized suppliers and retailers when necessary to ensure product availability.',
  "All products remain covered under Walherb's buyer protection and quality standards.",
];

interface SoldByModalProps {
  open: boolean;
  onClose: () => void;
}

export const SoldByModal = ({ open, onClose }: SoldByModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    TransitionComponent={Grow}
    transitionDuration={{ enter: 220, exit: 160 }}
    aria-labelledby="sold-by-title"
    PaperProps={{
      sx: {
        position: 'relative',
        borderRadius: { xs: '20px', sm: '24px' },
        maxWidth: 640,
        width: '100%',
        m: { xs: '16px', sm: '24px' },
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 24px 60px rgba(31, 50, 42, 0.18)',
      },
    }}
  >
    {/* Top-right circular close button */}
    <Box
      role="button"
      aria-label="Close"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Enter') onClose(); }}
      sx={{
        position: 'absolute',
        top: { xs: '16px', sm: '20px' },
        right: { xs: '16px', sm: '20px' },
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F5F3',
        border: '1px solid #E7E7E7',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': { backgroundColor: '#E9EBE7' },
      }}
    >
      <CloseIcon sx={{ fontSize: 18, color: '#474743' }} />
    </Box>

    <Box sx={{ p: { xs: '24px', sm: '40px' }, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography
        id="sold-by-title"
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semiBold,
          fontSize: { xs: '20px', sm: '24px' },
          lineHeight: '1.3',
          color: '#1F322A',
          pr: '40px',
        }}
      >
        Sold by
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {PARAGRAPHS.map((text) => (
          <Typography
            key={text}
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: { xs: '14px', sm: '15px' },
              lineHeight: '1.65',
              color: '#5A5750',
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>
    </Box>
  </Dialog>
);

export default SoldByModal;
