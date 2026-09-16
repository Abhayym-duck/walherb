'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

// ─── Payment method glyphs (inline SVG — no external/expiring assets) ────────────

const UpiIcon = () => (
  <Box component="svg" viewBox="0 0 24 24" sx={{ width: '100%', height: '100%', display: 'block' }} aria-hidden>
    <path d="M8.2 3 13.7 12 8.2 21Z" fill="#0DA02B" />
    <path d="M13 3 18.5 12 13 21Z" fill="#ED752E" />
  </Box>
);

const GpayIcon = () => (
  <Box component="svg" viewBox="0 0 24 24" sx={{ width: '100%', height: '100%', display: 'block' }} aria-hidden>
    <path d="M12 4a8 8 0 0 1 8 8" stroke="#4285F4" strokeWidth="4" fill="none" />
    <path d="M20 12a8 8 0 0 1-8 8" stroke="#EA4335" strokeWidth="4" fill="none" />
    <path d="M12 20a8 8 0 0 1-8-8" stroke="#FBBC05" strokeWidth="4" fill="none" />
    <path d="M4 12a8 8 0 0 1 8-8" stroke="#34A853" strokeWidth="4" fill="none" />
  </Box>
);

const PhonePeIcon = () => (
  <Box component="svg" viewBox="0 0 24 24" sx={{ width: '100%', height: '100%', display: 'block' }} aria-hidden>
    <rect width="24" height="24" rx="6" fill="#5F259F" />
    <path
      d="M16.6 9.1c0-.37-.3-.65-.66-.65h-1.4l-.42-1.13c-.1-.24-.3-.39-.55-.39h-1.02c-.28 0-.47.27-.38.52l.3.85H8.62c-.36 0-.66.3-.66.66 0 .37.3.65.66.65h.62v2.7c0 1.86.94 2.9 2.56 2.9.5 0 .92-.1 1.34-.3v1.55c0 .43.36.8.8.8h.54c.27 0 .47-.2.47-.47V10.4h1c.37 0 .67-.3.67-.65z"
      fill="#FFFFFF"
    />
  </Box>
);

const ICONS = [PhonePeIcon, GpayIcon, UpiIcon];

const PaymentIconStack = () => (
  <Box sx={{ position: 'relative', width: 48, height: 20, flexShrink: 0 }}>
    {ICONS.map((Icon, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute', left: i * 14, top: 0,
          width: 20, height: 20, borderRadius: '50%',
          backgroundColor: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          p: '3px', boxSizing: 'border-box',
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}><Icon /></Box>
      </Box>
    ))}
  </Box>
);

// ─── Razorpay wordmark (inline SVG mark + wordmark) ──────────────────────────────

export const RazorpayLogo = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', height: 16 }}>
    <Box component="svg" viewBox="0 0 12 16" sx={{ width: 11, height: 15, display: 'block', flexShrink: 0 }} aria-hidden>
      <path d="M7.4 0 2 8.85h3.2L3.5 16 11 6.6H7.05L9.2 0z" fill="#3395FF" />
    </Box>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', lineHeight: 1, letterSpacing: '0.2px', color, whiteSpace: 'nowrap' }}>
      Razorpay
    </Typography>
  </Box>
);

/**
 * Quick Checkout payment badge — stacked UPI/Wallet icons + Razorpay wordmark.
 * Matches Figma node 893-52660. Fully self-contained (no remote assets).
 */
export const QuickPayBadge = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <PaymentIconStack />
    <RazorpayLogo />
  </Box>
);

export default QuickPayBadge;
