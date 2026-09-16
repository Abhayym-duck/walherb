'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

// Payment methods rendered as self-contained text chips (no external/expiring assets).
const PAYMENT_METHODS = [
  { label: 'VISA',       color: '#1434CB' },
  { label: 'Mastercard', color: '#1A1A1A' },
  { label: 'AMEX',       color: '#1F72CD' },
  { label: 'UPI',        color: '#097939' },
  { label: 'Razorpay',   color: '#0C2451' },
] as const;

interface FooterLink {
  label: string;
  /** When set, clicking navigates to this route (deep-linked static pages). */
  path?: string;
}

const CUSTOMER_SERVICES: FooterLink[] = [
  { label: 'Track Order' },
  { label: 'Shipping & Customs' },
  { label: 'Returns & Exchanges' },
  { label: 'Payments' },
  { label: 'My Account' },
  { label: 'Report Infringement', path: '/report-infringement' },
];

const ABOUT_LINKS: FooterLink[] = [
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us' },
  { label: 'Our Brands' },
  { label: 'Authenticity Promise' },
  { label: 'Affiliate Program' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
  { label: 'Report Infringement', path: '/report-infringement' },
];

const SOCIALS = [
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'X', Icon: XIcon },
  { label: 'Facebook', Icon: FacebookIcon },
];

/** Navigate via the History API and let App's popstate listener resolve the view. */
const goTo = (path?: string) => {
  if (!path || typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const SUBTLE_BORDER = 'rgba(255,255,255,0.1)';

const footerLink = {
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.regular,
  fontSize: `${fontSize.b2}px`,
  lineHeight: lineHeight.b2,
  color: walherb.footerDim,
  cursor: 'pointer',
  width: 'fit-content',
  transition: 'color 0.15s',
  '&:hover': { color: '#FFFFFF' },
} as const;

const sectionTitle = {
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.semiBold,
  fontSize: `${fontSize.b3}px`,
  lineHeight: lineHeight.b3,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: walherb.footerMuted,
};

// ─── Reusable bits ──────────────────────────────────────────────────────────────

const NavLink = ({ link }: { link: FooterLink }) => (
  <Box
    role={link.path ? 'button' : undefined}
    tabIndex={link.path ? 0 : undefined}
    onClick={() => goTo(link.path)}
    onKeyDown={(e) => { if (link.path && e.key === 'Enter') goTo(link.path); }}
    sx={{ ...footerLink, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
  >
    <Typography component="span" sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b2}px`, lineHeight: lineHeight.b2, color: 'inherit' }}>
      {link.label}
    </Typography>
    {link.path && <NorthEastIcon sx={{ fontSize: 13, color: 'inherit' }} />}
  </Box>
);

const LinkColumn = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s16}px` }}>
    <Typography sx={sectionTitle}>{title}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s12}px` }}>
      {links.map((link) => <NavLink key={link.label} link={link} />)}
    </Box>
  </Box>
);

const SupportRow = ({ icon, title, sub, action, href }: { icon: React.ReactNode; title: string; sub: string; action: string; href?: string }) => (
  <Box sx={{ display: 'flex', gap: `${spacing.s12}px`, alignItems: 'flex-start' }}>
    <Box
      sx={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.06)', border: `1px solid ${SUBTLE_BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.b1}px`, lineHeight: lineHeight.b1, color: '#FFFFFF' }}>
        {title}
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, lineHeight: lineHeight.b3, color: walherb.footerDimmer }}>
        {sub}
      </Typography>
      <Typography
        component={href ? 'a' : 'span'}
        href={href}
        sx={{
          fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b2}px`,
          color: '#FFFFFF', textDecoration: 'none', cursor: 'pointer', width: 'fit-content', mt: '2px',
          borderBottom: '1px solid rgba(255,255,255,0.35)', pb: '1px',
          '&:hover': { borderBottomColor: '#FFFFFF' },
        }}
      >
        {action}
      </Typography>
    </Box>
  </Box>
);

const PaymentBadge = ({ label, color }: { label: string; color: string }) => (
  <Box
    sx={{
      height: 32, px: '10px', backgroundColor: '#FFFFFF', borderRadius: `${radius.radius4}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}
  >
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: 12, letterSpacing: '0.02em', color, whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
  </Box>
);

// ─── Footer ─────────────────────────────────────────────────────────────────────

export const Footer = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: walherb.greenDark,
      pt: { xs: `${spacing.s48}px`, md: `${spacing.s72}px` },
      px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px`, lg: '160px' },
    }}
  >
    {/* ── Top band: brand intro + social ─────────────────────────────────── */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-start' },
        gap: { xs: `${spacing.s24}px`, md: `${spacing.s40}px` },
        pb: { xs: `${spacing.s32}px`, md: `${spacing.s48}px` },
        borderBottom: `1px solid ${SUBTLE_BORDER}`,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s12}px`, maxWidth: 440 }}>
        <Typography sx={{ fontFamily: "var(--font-great-vibes, 'Great Vibes', cursive)", fontWeight: 400, fontSize: 40, color: '#FFFFFF', lineHeight: 'normal' }}>
          Walherb
        </Typography>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b2}px`, lineHeight: lineHeight.b1, color: walherb.footerMuted }}>
          Premium American wellness, beauty, bath &amp; baby care — landed in India with
          duties pre-paid, customs handled, and authenticity guaranteed on every order.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s12}px` }}>
        <Typography sx={sectionTitle}>Follow Us</Typography>
        <Box sx={{ display: 'flex', gap: `${spacing.s12}px` }}>
          {SOCIALS.map(({ label, Icon }) => (
            <Box
              key={label}
              role="button"
              tabIndex={0}
              aria-label={label}
              sx={{
                width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
                border: `1px solid ${SUBTLE_BORDER}`, backgroundColor: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.15s, border-color 0.15s',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.4)' },
              }}
            >
              <Icon sx={{ fontSize: 18, color: '#FFFFFF' }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    {/* ── Main columns ───────────────────────────────────────────────────── */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1.5fr 1fr 1fr' },
        columnGap: { xs: `${spacing.s32}px`, lg: `${spacing.s64}px` },
        rowGap: `${spacing.s40}px`,
        py: { xs: `${spacing.s40}px`, md: `${spacing.s56}px` },
      }}
    >
      {/* Customer Support */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s16}px`, gridColumn: { xs: '1 / -1', sm: '1 / -1', lg: 'auto' } }}>
        <Typography sx={sectionTitle}>Customer Support</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', lg: 'column' }, flexWrap: { sm: 'wrap', lg: 'nowrap' }, gap: `${spacing.s16}px` }}>
          <SupportRow icon={<ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />} title="Ask a Specialist" sub="Available 24 x 7" action="Start Chat" />
          <SupportRow icon={<MailOutlineIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />} title="Email Us" sub="Replies within 24 hours" action="support@walherb.com" href="mailto:support@walherb.com" />
          <SupportRow icon={<PhoneIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />} title="Call Us" sub="Mon–Sat, 9am–9pm IST" action="+91 22 5550 0114" href="tel:+912255500114" />
        </Box>
      </Box>

      <LinkColumn title="Customer Services" links={CUSTOMER_SERVICES} />
      <LinkColumn title="About Walherb" links={ABOUT_LINKS} />
    </Box>

    {/* ── Trust band: payments + legal links ─────────────────────────────── */}
    <Box
      sx={{
        borderTop: `1px solid ${SUBTLE_BORDER}`,
        pt: `${spacing.s28}px`,
        pb: `${spacing.s32}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacing.s20}px`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: `${spacing.s20}px`,
        }}
      >
        {/* Payments + secure badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s8}px`, flexWrap: 'wrap' }}>
          {PAYMENT_METHODS.map((m) => (
            <PaymentBadge key={m.label} label={m.label} color={m.color} />
          ))}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: '6px',
              height: 32, px: '10px', borderRadius: `${radius.radius4}px`,
              backgroundColor: walherb.footerDark, border: `1px solid ${walherb.footerBorderDark}`,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 13, color: '#20B526' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: 10, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
              Secure Payment
            </Typography>
          </Box>
        </Box>

        {/* Legal / compliance links */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: `${spacing.s12}px`, md: `${spacing.s20}px` } }}>
          {LEGAL_LINKS.map((link, i) => (
            <React.Fragment key={link.label}>
              {i > 0 && <Box sx={{ width: '1px', height: 12, backgroundColor: SUBTLE_BORDER, display: { xs: 'none', md: 'block' } }} />}
              <Box
                role="button"
                tabIndex={0}
                onClick={() => goTo(link.path)}
                onKeyDown={(e) => { if (e.key === 'Enter') goTo(link.path); }}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  color: walherb.footerDimmer, cursor: 'pointer', transition: 'color 0.15s',
                  '&:hover': { color: '#FFFFFF' },
                }}
              >
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b3}px`, color: 'inherit' }}>
                  {link.label}
                </Typography>
                <NorthEastIcon sx={{ fontSize: 13, color: 'inherit' }} />
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b3}px`, color: walherb.footerMuted }}>
        © 2026 Walherb eCommerce. All Rights Reserved.
      </Typography>
    </Box>
  </Box>
);

export default Footer;
