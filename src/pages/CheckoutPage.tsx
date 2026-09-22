'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import CircularProgress from '@mui/material/CircularProgress';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useCart } from '../context/CartContext';
import { useShipTo } from '../context/ShipToContext';
import { fontFamily, fontWeight } from '../design-system/tokens/typography';
import { QuickPayBadge } from '../components/payments/QuickPayBadge';

// Card-network logos (Figma assets — valid ~7 days from fetch)
const VISA_ICON      = 'https://www.figma.com/api/mcp/asset/42b84da9-6023-4b27-a112-cc8d770870b5';
const MC_ICON        = 'https://www.figma.com/api/mcp/asset/adcce35d-d2d1-47fc-893b-dacb14ee8a83';
const AMEX_ICON      = 'https://www.figma.com/api/mcp/asset/0323d4f0-e016-4e8c-87c0-46e659f471a6';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh',
];

const NOTICE_TEXT =
  "As per India Customs, all customers ordering internationally are required to complete KYC documents for customs clearance. The shipping information must be an exact match to the consignee's name and residential address. Failure to provide accurate KYC information may result in delivery delays or package rejection at customs.";

const INPUT_SX = {
  border: '1px solid #D9D9D9',
  borderRadius: '12px',
  padding: '12px 14px',
  fontSize: '16px',
  lineHeight: '22.4px',
  fontFamily: fontFamily.sans,
  color: '#41403B',
  backgroundColor: '#FFFFFF',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.15s, box-shadow 0.15s',
  '&::placeholder': { color: '#97939E' },
  '&:focus': { borderColor: '#476D59', boxShadow: '0 0 0 3px rgba(71,109,89,0.12)' },
};

const SELECT_SX = {
  ...INPUT_SX,
  appearance: 'none' as const,
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2397939E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: '36px',
};

const InternationalShippingTag = () => (
  <svg width="164" height="33" viewBox="0 0 164 33" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
    <rect width="136" height="33" fill="#1F322A"/>
    <path d="M164 0H136V28L164 0Z" fill="#1F322A"/>
    <path d="M164 33H136V5L164 33Z" fill="#1F322A"/>
    <text x="8" y="16.5" dominantBaseline="middle" fill="white" fontFamily="'DM Sans', sans-serif" fontWeight="500" fontSize="12">International Shipping</text>
  </svg>
);

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{
      fontFamily: fontFamily.sans,
      fontWeight: fontWeight.medium,
      fontSize: '14px',
      lineHeight: '18.2px',
      color: '#433C50',
      mb: '4px',
      display: 'block',
    }}>
      {children}
    </Typography>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{
      fontFamily: fontFamily.sans,
      fontWeight: fontWeight.semiBold,
      fontSize: '22px',
      lineHeight: '28.6px',
      color: '#3E3E3C',
      mb: '16px',
    }}>
      {children}
    </Typography>
  );
}

function getDeliveryRange(): string {
  const now = new Date();
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const start = new Date(now); start.setDate(now.getDate() + 10);
  const end   = new Date(now); end.setDate(now.getDate() + 12);
  return `${fmt(start)} – ${fmt(end)}`;
}

interface Props {
  onBack: () => void;
  onQuickCheckout?: () => void;
}

export default function CheckoutPage({ onBack, onQuickCheckout }: Props) {
  const { items, totalValue } = useCart();
  const { formatPrice } = useShipTo();

  const [email,          setEmail]          = useState('');
  const [newsletter,     setNewsletter]     = useState(false);
  const [firstName,      setFirstName]      = useState('');
  const [lastName,       setLastName]       = useState('');
  const [address,        setAddress]        = useState('');
  const [apt,            setApt]            = useState('');
  const [state,          setState]          = useState('Maharashtra');
  const [city,           setCity]           = useState('');
  const [pincode,        setPincode]        = useState('');
  const [mobile,         setMobile]         = useState('');
  const [textUpdates,    setTextUpdates]    = useState(false);
  const [payMethod,      setPayMethod]      = useState<'card' | 'more'>('card');
  const [promo,          setPromo]          = useState('');
  const [promoApplied,   setPromoApplied]   = useState(false);
  const [placing,        setPlacing]        = useState(false);
  const [noticeExpanded, setNoticeExpanded] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const discount     = promoApplied ? Math.round(totalValue * 0.1) : 0;
  const total        = totalValue - discount;
  const fmt          = formatPrice;
  const deliveryRange = getDeliveryRange();
  const totalQty     = items.reduce((s, i) => s + i.qty, 0);

  const handlePayNow = () => {
    if (placing) return;
    setPlacing(true);
    setTimeout(() => { setPlacing(false); onQuickCheckout?.(); }, 700);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', backgroundColor: '#FFFFFF' }}>

      {/* ── Mobile top bar (xs only) ─────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          order: { xs: 1, md: 0 },
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#1F322A',
          px: '12px',
          py: '8px',
          borderBottom: '1px solid #EDEDED',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box
          role="button"
          tabIndex={0}
          aria-label="Close checkout"
          onClick={onBack}
          onKeyDown={(e) => { if (e.key === 'Enter') onBack(); }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, cursor: 'pointer', flexShrink: 0 }}
        >
          <CloseIcon sx={{ fontSize: 20, color: '#E6EFEB' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '18px', lineHeight: '23.4px', color: '#E6EFEB', whiteSpace: 'nowrap' }}>
            My Cart
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#43564E', border: '1px solid #4D6058', borderRadius: '24px', px: '16px', py: '8px', flexShrink: 0 }}>
            <LocalShippingOutlinedIcon sx={{ fontSize: 16, color: '#E6EFEB' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: '19.6px', color: '#E6EFEB', whiteSpace: 'nowrap' }}>
              Ship to India
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Mobile Order Summary accordion header (xs only) ──────────── */}
      <Box
        role="button"
        tabIndex={0}
        onClick={() => setMobileSummaryOpen((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMobileSummaryOpen((v) => !v); }}
        sx={{
          display: { xs: 'flex', md: 'none' },
          order: { xs: 2, md: 0 },
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F7F7F7',
          borderBottom: '1px solid #EBE8E4',
          p: '12px',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', lineHeight: '20.8px', color: '#3E3E3C' }}>
            Order Summary
          </Typography>
          {mobileSummaryOpen
            ? <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#3E3E3C' }} />
            : <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#3E3E3C' }} />}
        </Box>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', lineHeight: '20.8px', color: '#3E3E3C' }}>
          {fmt(total)}
        </Typography>
      </Box>

      {/* ── Left column — checkout form ──────────────────────────────── */}
      <Box sx={{ flex: { xs: 1, md: '0 0 50%' }, maxWidth: { md: '50%' }, minWidth: 0, backgroundColor: '#FFFFFF', overflowY: 'auto', order: { xs: 4, md: 0 } }}>
        <Box sx={{ maxWidth: 460, mx: 'auto', px: { xs: '16px', md: '24px' }, py: { xs: '24px', md: '80px' } }}>

          {/* Logo — desktop only (mobile uses the top bar) */}
          <Typography
            onClick={onBack}
            sx={{
              fontFamily: "var(--font-pacifico, 'Pacifico', cursive)",
              fontWeight: 400,
              fontSize: 40,
              color: '#1F322A',
              cursor: 'pointer',
              lineHeight: 'normal',
              mb: '24px',
              userSelect: 'none',
              textAlign: 'center',
              display: { xs: 'none', md: 'block' },
            }}
          >
            Walherb
          </Typography>

          {/* Express Checkout */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '24px' }}>
            <Typography sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: '16px',
              lineHeight: '20.8px',
              color: '#41403B',
              textAlign: 'center',
            }}>
              Express Checkout
            </Typography>

            <Box
              component="button"
              onClick={onQuickCheckout}
              sx={{
                width: '100%',
                backgroundColor: '#1F322A',
                border: 'none',
                borderRadius: '12px',
                py: '16px',
                px: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#29433A' },
              }}
            >
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '16px',
                lineHeight: '20.8px',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}>
                Quick Checkout
              </Typography>
              <QuickPayBadge />
            </Box>
          </Box>

          {/* OR divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '20px' }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E3E6EC' }} />
            <Typography sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: '14px',
              lineHeight: '18.2px',
              color: '#41403B',
            }}>
              or
            </Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E3E6EC' }} />
          </Box>

          {/* ── Contact ─────────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mb: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '4px' }}>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '14px',
                lineHeight: '18.2px',
                color: '#433C50',
              }}>
                Contact
              </Typography>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#41403B',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}>
                Sign in
              </Typography>
            </Box>

            <Box
              component="input"
              type="email"
              value={email}
              placeholder="Email"
              sx={INPUT_SX}
              {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', py: '2px' }}>
              <Checkbox
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                size="small"
                sx={{ p: '2px', color: '#D9D9D9', '&.Mui-checked': { color: '#476D59' } }}
              />
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#41403B',
              }}>
                email me with news and offers
              </Typography>
            </Box>
          </Box>

          {/* ── Delivery ────────────────────────────────────────────────── */}
          <Box sx={{ mb: '20px' }}>
            <SectionHeading>Delivery</SectionHeading>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Country */}
              <Box>
                <FieldLabel>Country</FieldLabel>
                <Box component="select" value="India" sx={SELECT_SX}>
                  <option value="India">India</option>
                </Box>
              </Box>

              {/* First Name + Last Name */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Box>
                  <FieldLabel>First Name</FieldLabel>
                  <Box component="input" value={firstName} sx={INPUT_SX}
                    {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value) }} />
                </Box>
                <Box>
                  <FieldLabel>Last Name</FieldLabel>
                  <Box component="input" value={lastName} sx={INPUT_SX}
                    {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value) }} />
                </Box>
              </Box>

              {/* Address */}
              <Box>
                <FieldLabel>Address</FieldLabel>
                <Box component="input" value={address} placeholder="India" sx={INPUT_SX}
                  {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value) }} />
              </Box>

              {/* Apartment */}
              <Box>
                <FieldLabel>Apartment,suite, etc. (optional)</FieldLabel>
                <Box component="input" value={apt} placeholder="India" sx={INPUT_SX}
                  {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setApt(e.target.value) }} />
              </Box>

              {/* State / City / Pincode */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <Box>
                  <FieldLabel>State</FieldLabel>
                  <Box component="select" value={state} sx={SELECT_SX}
                    {...{ onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setState(e.target.value) }}>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Box>
                </Box>
                <Box>
                  <FieldLabel>City</FieldLabel>
                  <Box component="input" value={city} sx={INPUT_SX}
                    {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value) }} />
                </Box>
                <Box>
                  <FieldLabel>Pincode</FieldLabel>
                  <Box component="input" value={pincode} sx={INPUT_SX}
                    {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPincode(e.target.value), maxLength: 6 }} />
                </Box>
              </Box>

              {/* Mobile Number */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Box>
                  <FieldLabel>Mobile Number</FieldLabel>
                  <Box component="input" type="tel" value={mobile} placeholder="Enter" sx={INPUT_SX}
                    {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value) }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', py: '2px' }}>
                  <Checkbox
                    checked={textUpdates}
                    onChange={(e) => setTextUpdates(e.target.checked)}
                    size="small"
                    sx={{ p: '2px', color: '#D9D9D9', '&.Mui-checked': { color: '#476D59' } }}
                  />
                  <Typography sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.regular,
                    fontSize: '14px',
                    lineHeight: '19.6px',
                    color: '#41403B',
                  }}>
                    Text me with news and offers
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Shipment method ─────────────────────────────────────────── */}
          <Box sx={{ mb: '20px' }}>
            <SectionHeading>Shipment method</SectionHeading>
            <Box sx={{
              border: '1px solid #EDEDED',
              borderRadius: '12px',
              p: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}>
              <Radio
                checked
                readOnly
                size="small"
                sx={{ p: '2px', mt: '1px', flexShrink: 0, '&.Mui-checked': { color: '#41403B' } }}
              />
              <Box>
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.semiBold,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#41403B',
                }}>
                  Standard
                </Typography>
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.regular,
                  fontSize: '14px',
                  lineHeight: '19.6px',
                  color: '#41403B',
                }}>
                  Standard Shipping - Includes shipping, duties, and fees
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Payment method ──────────────────────────────────────────── */}
          <Box sx={{ mb: '20px' }}>
            <SectionHeading>Payment method</SectionHeading>
            <Box sx={{ border: '1px solid #EDEDED', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Credit or debit card */}
              <Box
                onClick={() => setPayMethod('card')}
                sx={{
                  p: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #EDEDED',
                  '&:hover': { backgroundColor: '#F7F7F7' },
                }}
              >
                <Radio
                  checked={payMethod === 'card'}
                  size="small"
                  sx={{ p: '2px', flexShrink: 0, '&.Mui-checked': { color: '#41403B' } }}
                  onChange={() => setPayMethod('card')}
                />
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.semiBold,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#41403B',
                  flex: 1,
                }}>
                  Credit or debit card
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Box sx={{ border: '1px solid #EDE6E6', borderRadius: '4px', px: '8px', py: '1px', display: 'flex', alignItems: 'center' }}>
                    <Box component="img" src={VISA_ICON} alt="Visa" sx={{ width: 28.8, height: 24, objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ border: '1px solid #EDE6E6', borderRadius: '4px', px: '8px', py: '1px', display: 'flex', alignItems: 'center' }}>
                    <Box component="img" src={MC_ICON} alt="Mastercard" sx={{ width: 24, height: 24, objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ border: '1px solid #EDE6E6', borderRadius: '4px', px: '8px', py: '1px', display: 'flex', alignItems: 'center' }}>
                    <Box component="img" src={AMEX_ICON} alt="Amex" sx={{ width: 39, height: 26, objectFit: 'cover' }} />
                  </Box>
                </Box>
              </Box>

              {/* More Payment Options */}
              <Box
                onClick={() => setPayMethod('more')}
                sx={{
                  p: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#F7F7F7' },
                }}
              >
                <Radio
                  checked={payMethod === 'more'}
                  size="small"
                  sx={{ p: '2px', flexShrink: 0, '&.Mui-checked': { color: '#41403B' } }}
                  onChange={() => setPayMethod('more')}
                />
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.semiBold,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#41403B',
                }}>
                  More Payment Options
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Pay Now */}
          <Box
            component="button"
            onClick={handlePayNow}
            disabled={placing}
            sx={{
              width: '100%',
              backgroundColor: placing ? '#7F9F8F' : '#1F322A',
              border: 'none',
              borderRadius: '12px',
              py: '16px',
              px: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: placing ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              '&:hover:not(:disabled)': { backgroundColor: '#29433A' },
            }}
          >
            {placing ? (
              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
            ) : (
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: '16px',
                lineHeight: '20.8px',
                color: '#FFFFFF',
              }}>
                Pay Now
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Right column — order summary (desktop) / mobile accordion body ─ */}
      <Box sx={{
        width: { xs: '100%', md: '50%' },
        flex: { md: '0 0 50%' },
        backgroundColor: '#F9F9F9',
        flexShrink: 0,
        display: { xs: mobileSummaryOpen ? 'block' : 'none', md: 'block' },
        order: { xs: 3, md: 0 },
      }}>
        <Box sx={{
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          // No inner scroll — the whole page scrolls together (no second scrollbar).
          overflow: 'visible',
          // Cap the summary content and left-align it (hug the centre divider)
          // so it doesn't stretch across the full 50% column on wide screens.
          width: '100%',
          maxWidth: { md: 560 },
          px: { xs: '16px', md: '40px' },
          py: { xs: '24px', md: '80px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '24px', md: '40px' },
        }}>

          {/* ── Products ── */}
          {items.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => {
                const savings = item.originalValue - item.priceValue;
                return (
                  <Box key={`${item.product.id}-${item.pkgIdx}`} sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Product row */}
                    <Box sx={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                      {/* Image */}
                      <Box sx={{
                        flexShrink: 0,
                        width: 104,
                        height: 104,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        p: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Box
                          component="img"
                          src={item.product.image}
                          alt={item.product.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>

                      {/* Text info */}
                      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Typography sx={{
                          fontFamily: fontFamily.sans,
                          fontWeight: fontWeight.semiBold,
                          fontSize: '14px',
                          lineHeight: '18.2px',
                          color: '#41403B',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {item.product.title}{item.pkgLabel ? ` — ${item.pkgLabel}` : ''}
                        </Typography>

                        {/* Shipping tag row */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <InternationalShippingTag />
                          <Typography sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.medium,
                            fontSize: '12px',
                            lineHeight: '16.8px',
                            color: '#3D3A42',
                            whiteSpace: 'nowrap',
                          }}>
                            Ships from outside the India.
                          </Typography>
                          <Typography
                            component="button"
                            sx={{
                              fontFamily: fontFamily.sans,
                              fontWeight: fontWeight.medium,
                              fontSize: '12px',
                              lineHeight: '16.8px',
                              color: '#3371D5',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              p: 0,
                            }}
                          >
                            Learn more
                          </Typography>
                        </Box>

                        {/* Delivery estimate */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: '#3371D5' }} />
                          <Typography sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.medium,
                            fontSize: '14px',
                            lineHeight: '19.6px',
                            color: '#3371D5',
                            whiteSpace: 'nowrap',
                          }}>
                            Estimate Delivery: {deliveryRange}, Delivering to India
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Price + qty row */}
                    <Box sx={{ px: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Typography sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.semiBold,
                            fontSize: '22px',
                            lineHeight: '28.6px',
                            color: '#3E3E3C',
                          }}>
                            {formatPrice(item.priceValue)}
                          </Typography>
                          {savings > 0 && (
                            <Typography sx={{
                              fontFamily: fontFamily.sans,
                              fontWeight: fontWeight.medium,
                              fontSize: '16px',
                              lineHeight: '22.4px',
                              color: '#B5B0B0',
                              textDecoration: 'line-through',
                            }}>
                              {formatPrice(item.originalValue)}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', py: '4px' }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: '#41403B' }} />
                          <Typography sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.regular,
                            fontSize: '14px',
                            lineHeight: '19.6px',
                            color: '#41403B',
                          }}>
                            Duties &amp; Taxes Included
                          </Typography>
                        </Box>
                      </Box>

                      {/* Qty stepper */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        border: '1px solid #EBE8E4',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        px: '12px',
                        py: '6px',
                      }}>
                        <RemoveIcon sx={{ fontSize: 16, color: '#686E6B', cursor: 'pointer' }} />
                        <Typography sx={{
                          fontFamily: fontFamily.sans,
                          fontWeight: fontWeight.regular,
                          fontSize: '16px',
                          lineHeight: 'normal',
                          color: '#686E6B',
                        }}>
                          {item.qty}
                        </Typography>
                        <AddIcon sx={{ fontSize: 16, color: '#686E6B', cursor: 'pointer' }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography sx={{
              fontFamily: fontFamily.sans,
              fontSize: '14px',
              color: '#97939E',
              textAlign: 'center',
              py: '16px',
            }}>
              No items in cart
            </Typography>
          )}

          {/* ── Special Notice ── */}
          <Box sx={{
            border: '1px solid #CFDAEB',
            borderRadius: '12px',
            p: '16px',
            backgroundColor: '#E3EEFF',
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
                  ...(noticeExpanded ? {} : {
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }),
                }}>
                  {NOTICE_TEXT}
                </Typography>
              </Box>
              <Box
                component="button"
                onClick={() => setNoticeExpanded(v => !v)}
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
                  {noticeExpanded ? 'Show less' : 'Show more'}
                </Typography>
                {noticeExpanded
                  ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: '#3371D5' }} />
                  : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#3371D5' }} />
                }
              </Box>
            </Box>
          </Box>

          {/* ── Promo + Order Summary ── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Promo code */}
            <Box sx={{
              backgroundColor: '#F7F7F7',
              border: '1px solid #EDEDED',
              borderRadius: '12px',
              p: '16px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end',
            }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: '14px',
                  lineHeight: '19.6px',
                  color: '#433C50',
                }}>
                  Promo code
                </Typography>
                <Box
                  component="input"
                  value={promo}
                  placeholder="Enter code"
                  sx={{
                    border: '1px solid #B3B1B1',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '16px',
                    lineHeight: '22.4px',
                    fontFamily: fontFamily.sans,
                    color: '#41403B',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box' as const,
                    '&::placeholder': { color: '#97939E' },
                    '&:focus': { borderColor: '#476D59' },
                  }}
                  {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPromo(e.target.value) }}
                />
              </Box>
              <Box
                component="button"
                onClick={() => { if (promo.trim()) setPromoApplied(true); }}
                sx={{
                  backgroundColor: '#1F322A',
                  border: 'none',
                  borderRadius: '12px',
                  px: '8px',
                  py: '12px',
                  width: 132,
                  flexShrink: 0,
                  cursor: 'pointer',
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#29433A' },
                }}
              >
                Apply
              </Box>
            </Box>

            {/* Order Summary */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: '22px',
                lineHeight: '28.6px',
                color: '#3E3E3C',
              }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Items Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Typography sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.semiBold,
                      fontSize: '16px',
                      lineHeight: '20.8px',
                      color: '#3E3E3C',
                      whiteSpace: 'nowrap',
                    }}>
                      Items Total ({totalQty})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', py: '2px' }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#41403B' }} />
                      <Typography sx={{
                        fontFamily: fontFamily.sans,
                        fontWeight: fontWeight.regular,
                        fontSize: '14px',
                        lineHeight: '19.6px',
                        color: '#41403B',
                        whiteSpace: 'nowrap',
                      }}>
                        Duties &amp; Taxes Included
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.semiBold,
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    color: '#3E3E3C',
                    whiteSpace: 'nowrap',
                  }}>
                    {fmt(totalValue)}
                  </Typography>
                </Box>

                {/* Shipping */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.semiBold,
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    color: '#3E3E3C',
                  }}>
                    Shipping
                  </Typography>
                  <Typography sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.semiBold,
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    color: '#33944A',
                  }}>
                    Free
                  </Typography>
                </Box>

                {/* Duties & Taxes */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.semiBold,
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    color: '#3E3E3C',
                  }}>
                    Duties &amp; Taxes
                  </Typography>
                  <Typography sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.semiBold,
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    color: '#3E3E3C',
                  }}>
                    --
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#E3E6EC', my: '4px' }} />

              {/* Total amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: '18px',
                  lineHeight: '23.4px',
                  color: '#3E3E3C',
                }}>
                  Total amount
                </Typography>
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: '18px',
                  lineHeight: '23.4px',
                  color: '#3E3E3C',
                }}>
                  {fmt(total)}
                </Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
