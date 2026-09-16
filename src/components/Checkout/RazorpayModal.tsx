'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { useCart } from '../../context/CartContext';

const RAZORPAY_BLUE   = '#2a72b5';
const SIDEBAR_BG      = 'linear-gradient(155deg, #1F322A 0%, #2D4D38 55%, #1A2E24 100%)';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const RazorpayModal = ({ open, onClose }: Props) => {
  const [loading, setLoading] = useState(true);
  const [step, setStep]       = useState<'contact' | 'address' | 'payment'>('contact');
  const [mobile, setMobile]   = useState('');
  const [email, setEmail]     = useState('');
  const [whatsapp, setWhatsapp] = useState(true);
  const { items, totalValue }  = useCart();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setStep('contact');
    setMobile('');
    setEmail('');
    setWhatsapp(true);
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, [open]);

  const fmt    = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const STEPS  = ['contact', 'address', 'payment'] as const;
  const stepIdx = STEPS.indexOf(step);

  const INPUT_SX = {
    width: '100%',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    px: '12px',
    py: '10px',
    fontSize: '14px',
    fontFamily: fontFamily.sans,
    color: '#1A1A1A',
    outline: 'none',
    boxSizing: 'border-box' as const,
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.15s',
    '&::placeholder': { color: '#9CA3AF' },
    '&:focus': { borderColor: RAZORPAY_BLUE },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 0, md: '24px' } }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.72)' } } }}
    >
      <Box sx={{ outline: 'none' }}>

        {/* ── Loading state ─────────────────────────────────────────── */}
        {loading && (
          <Box sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            p: '40px 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            minWidth: 280,
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <ShieldIcon sx={{ fontSize: 44, color: RAZORPAY_BLUE }} />
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: '16px',
                color: '#111827',
              }}>
                Secured by Razorpay
              </Typography>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: '13px',
                color: '#6B7280',
              }}>
                Loading payment gateway…
              </Typography>
            </Box>
            <CircularProgress size={24} sx={{ color: RAZORPAY_BLUE }} />
          </Box>
        )}

        {/* ── Full checkout modal ───────────────────────────────────── */}
        {!loading && (
          <Box sx={{
            display: 'flex',
            width: { xs: '100vw', md: 1002 },
            height: { xs: '100vh', md: 584 },
            borderRadius: { xs: 0, md: '12px' },
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          }}>

            {/* Left sidebar */}
            <Box sx={{
              width: 280,
              background: SIDEBAR_BG,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              p: '28px 22px',
              gap: '18px',
              flexShrink: 0,
            }}>
              {/* Walherb logo */}
              <Typography sx={{
                fontFamily: "var(--font-pacifico, 'Pacifico', cursive)",
                fontWeight: 400,
                fontSize: 20,
                color: '#FFFFFF',
                lineHeight: 'normal',
              }}>
                Walherb
              </Typography>

              {/* Amount */}
              <Box>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: 'rgba(255,255,255,0.6)', mb: '4px' }}>
                  Pay
                </Typography>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: '26px', color: '#FFFFFF', lineHeight: 1 }}>
                  {fmt(totalValue)}
                </Typography>
              </Box>

              {/* Order items card */}
              <Box sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                p: '12px',
                border: '1px solid rgba(255,255,255,0.14)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {items.slice(0, 3).map((item) => (
                  <Box key={`${item.product.id}-${item.pkgIdx}`} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Box sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Box
                        component="img"
                        src={item.product.image}
                        alt=""
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{
                        fontFamily: fontFamily.sans,
                        fontWeight: fontWeight.medium,
                        fontSize: '12px',
                        color: '#FFFFFF',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.product.title}
                      </Typography>
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
                        Qty {item.qty}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                      {item.formattedPrice}
                    </Typography>
                  </Box>
                ))}
                {items.length > 3 && (
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '11px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                    +{items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                  </Typography>
                )}
                {items.length === 0 && (
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                    Cart is empty
                  </Typography>
                )}
              </Box>

              {/* Coupon row */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '8px',
                p: '10px 12px',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.13)' },
              }}>
                <LocalOfferIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                  Apply Coupon
                </Typography>
              </Box>

              {/* Secured footer */}
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  Secured by Razorpay
                </Typography>
              </Box>
            </Box>

            {/* Right content */}
            <Box sx={{ flex: 1, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* Top bar: stepper + close */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: '24px',
                py: '14px',
                borderBottom: '1px solid #F3F4F6',
                flexShrink: 0,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {STEPS.map((s, i) => (
                    <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Box sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: stepIdx === i
                          ? RAZORPAY_BLUE
                          : stepIdx > i
                            ? '#22C55E'
                            : '#E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'background-color 0.2s',
                      }}>
                        {stepIdx > i ? (
                          <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
                        ) : (
                          <Typography sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.bold,
                            fontSize: '11px',
                            color: stepIdx === i ? '#FFFFFF' : '#9CA3AF',
                            lineHeight: 1,
                          }}>
                            {i + 1}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{
                        fontFamily: fontFamily.sans,
                        fontWeight: stepIdx === i ? fontWeight.semiBold : fontWeight.regular,
                        fontSize: '13px',
                        color: stepIdx === i ? '#111827' : stepIdx > i ? '#22C55E' : '#9CA3AF',
                        textTransform: 'capitalize',
                        transition: 'color 0.2s',
                        display: { xs: 'none', sm: 'block' },
                      }}>
                        {s}
                      </Typography>
                      {i < STEPS.length - 1 && (
                        <Box sx={{ width: 20, height: 1, backgroundColor: '#E5E7EB', mx: '2px', display: { xs: 'none', sm: 'block' } }} />
                      )}
                    </Box>
                  ))}
                </Box>

                <Box
                  component="button"
                  onClick={onClose}
                  sx={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    p: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    color: '#6B7280',
                    '&:hover': { backgroundColor: '#F5F5F5', color: '#374151' },
                    transition: 'all 0.15s',
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>

              {/* Form area */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: '28px', py: '24px' }}>

                {/* Contact step */}
                {step === 'contact' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 420 }}>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#111827', mb: '4px' }}>
                      Contact Details
                    </Typography>

                    {/* Mobile */}
                    <Box>
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#374151', mb: '6px' }}>
                        Mobile Number
                      </Typography>
                      <Box sx={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.15s', '&:focus-within': { borderColor: RAZORPAY_BLUE } }}>
                        <Box sx={{
                          px: '12px',
                          backgroundColor: '#F9FAFB',
                          borderRight: '1px solid #D1D5DB',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0,
                        }}>
                          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#374151' }}>
                            🇮🇳 +91
                          </Typography>
                        </Box>
                        <Box
                          component="input"
                          type="tel"
                          value={mobile}
                          placeholder="Mobile number"
                          sx={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            px: '12px',
                            py: '10px',
                            fontSize: '14px',
                            fontFamily: fontFamily.sans,
                            color: '#111827',
                            backgroundColor: '#FFFFFF',
                            '&::placeholder': { color: '#9CA3AF' },
                          }}
                          {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value) }}
                        />
                      </Box>
                    </Box>

                    {/* Email */}
                    <Box>
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#374151', mb: '6px' }}>
                        Email Address
                      </Typography>
                      <Box
                        component="input"
                        type="email"
                        value={email}
                        placeholder="Email address"
                        sx={INPUT_SX}
                        {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) }}
                      />
                    </Box>

                    {/* WhatsApp toggle */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', mt: '4px' }}>
                      <Box
                        component="input"
                        type="checkbox"
                        checked={whatsapp}
                        sx={{ mt: '2px', cursor: 'pointer', accentColor: RAZORPAY_BLUE, flexShrink: 0 }}
                        {...{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setWhatsapp(e.target.checked) }}
                      />
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#4B5563', lineHeight: '18px' }}>
                        Get shipping updates &amp; exclusive offers via WhatsApp
                      </Typography>
                    </Box>

                    {/* Continue */}
                    <Box
                      component="button"
                      onClick={() => setStep('address')}
                      sx={{
                        backgroundColor: RAZORPAY_BLUE,
                        border: 'none',
                        borderRadius: '8px',
                        py: '13px',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background-color 0.2s',
                        '&:hover': { backgroundColor: '#1a5fa3' },
                        mt: '8px',
                      }}
                    >
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: '#FFFFFF', textAlign: 'center' }}>
                        Continue
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <SecurityIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#9CA3AF' }}>
                        Your data is safe and encrypted.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Address step */}
                {step === 'address' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 420 }}>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#111827', mb: '4px' }}>
                      Delivery Address
                    </Typography>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#6B7280', lineHeight: '20px' }}>
                      Enter your delivery address to calculate shipping and applicable taxes.
                    </Typography>
                    <Box sx={{ p: '16px', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#0369A1' }}>
                        For this demo, address collection is simulated. Click Continue to proceed.
                      </Typography>
                    </Box>
                    <Box
                      component="button"
                      onClick={() => setStep('payment')}
                      sx={{
                        backgroundColor: RAZORPAY_BLUE,
                        border: 'none',
                        borderRadius: '8px',
                        py: '13px',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background-color 0.2s',
                        '&:hover': { backgroundColor: '#1a5fa3' },
                        mt: '8px',
                      }}
                    >
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: '#FFFFFF', textAlign: 'center' }}>
                        Continue
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Payment step */}
                {step === 'payment' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 420 }}>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#111827', mb: '4px' }}>
                      Payment
                    </Typography>

                    {/* Card option (selected) */}
                    <Box sx={{
                      border: `2px solid ${RAZORPAY_BLUE}`,
                      borderRadius: '10px',
                      p: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#EFF6FF',
                      cursor: 'pointer',
                    }}>
                      <Box
                        component="input"
                        type="radio"
                        checked
                        readOnly
                        sx={{ accentColor: RAZORPAY_BLUE, flexShrink: 0 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#1E40AF' }}>
                          Credit / Debit Card
                        </Typography>
                        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#93C5FD' }}>
                          Visa, Mastercard, Amex, RuPay
                        </Typography>
                      </Box>
                    </Box>

                    {/* UPI option */}
                    <Box sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      p: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#F9FAFB' },
                    }}>
                      <Box component="input" type="radio" readOnly sx={{ accentColor: RAZORPAY_BLUE, flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#374151' }}>
                          UPI
                        </Typography>
                        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#9CA3AF' }}>
                          GPay, PhonePe, Paytm, BHIM
                        </Typography>
                      </Box>
                    </Box>

                    {/* Pay button */}
                    <Box
                      component="button"
                      onClick={onClose}
                      sx={{
                        backgroundColor: RAZORPAY_BLUE,
                        border: 'none',
                        borderRadius: '8px',
                        py: '14px',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background-color 0.2s',
                        '&:hover': { backgroundColor: '#1a5fa3' },
                        mt: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <ShieldIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: '#FFFFFF', textAlign: 'center' }}>
                        Pay {fmt(totalValue)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', mt: '4px' }}>
                      <ShieldIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#9CA3AF' }}>
                        Secured by Razorpay · 256-bit SSL
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default RazorpayModal;
