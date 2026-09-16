'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

const FAQ_ITEMS = [
  {
    question: 'Are your products authentic?',
    answer:
      "Yes. Every product is sourced directly from verified brands and authorized suppliers. We carefully review product authenticity, storage conditions, and supplier credentials before any item is listed on Walherb. When you shop with us, you can be confident you're receiving genuine products from trusted sources.",
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Most orders are delivered within 3–7 business days to major Indian cities. Express delivery is available in 2–3 days for select pincodes. You will receive a tracking link as soon as your order ships.',
  },
  {
    question: 'Will my products stay fresh?',
    answer:
      'All perishable items are stored in temperature-controlled facilities and shipped with appropriate cold-chain packaging where required. Every product arrives with manufacturing and expiry dates clearly visible.',
  },
  {
    question: 'Can I return a product?',
    answer:
      "Yes, we offer 30-day easy returns on most items. If your product is damaged, incorrect, or not as described, we'll arrange a free pickup and issue a full refund within 3–5 business days — no questions asked.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept UPI, all major credit/debit cards (Visa, Mastercard, Amex), net banking, popular wallets (Paytm, PhonePe, GPay), and no-cost EMI on orders above ₹3,000.',
  },
  {
    question: 'Can I track my order after purchase?',
    answer:
      "Yes! You'll receive a tracking link via email and SMS once your order ships. You can also log into your account and track your order in real-time from the 'My Orders' section.",
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ question, answer, isOpen, onToggle }: AccordionItemProps) => (
  <Box
    sx={{
      backgroundColor: walherb.bgSection,
      border: `1px solid ${walherb.border}`,
      borderRadius: `${radius.radius16}px`,
      overflow: 'hidden',
    }}
  >
    <Box
      component="button"
      onClick={onToggle}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: `${spacing.s24}px`,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        gap: `${spacing.s16}px`,
      }}
    >
      <Typography
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: `${fontSize.t2}px`,
          lineHeight: lineHeight.t2,
          color: walherb.greenDark,
        }}
      >
        {question}
      </Typography>
      {isOpen ? (
        <RemoveIcon sx={{ fontSize: 20, color: walherb.greenPrimary, flexShrink: 0 }} />
      ) : (
        <AddIcon sx={{ fontSize: 20, color: walherb.greenPrimary, flexShrink: 0 }} />
      )}
    </Box>

    {isOpen && (
      <Box sx={{ px: `${spacing.s24}px`, pb: `${spacing.s24}px` }}>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: `${fontSize.b1}px`,
            lineHeight: lineHeight.b1,
            color: walherb.greenMid,
          }}
        >
          {answer}
        </Typography>
      </Box>
    )}
  </Box>
);

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <Box
      sx={{
        px: { xs: `${spacing.s16}px`, md: `${spacing.s120}px` },
        py: { xs: `${spacing.s48}px`, md: `${spacing.s40}px` },
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: `${spacing.s40}px`, md: `${spacing.s80}px` },
          alignItems: 'flex-start',
        }}
      >
        {/* Left column */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: 560 },
            display: 'flex',
            flexDirection: 'column',
            gap: `${spacing.s40}px`,
          }}
        >
          {/* Heading */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s12}px` }}>
            <Typography
              sx={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontWeight: 700,
                fontSize: { xs: 36, md: `${fontSize.displayLarge}px` },
                lineHeight: { xs: '44px', md: lineHeight.displayLarge },
                color: walherb.greenDark,
                letterSpacing: '-1.12px',
                whiteSpace: 'pre-line',
              }}
            >
              {'Real questions.\nStraight answers.'}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: `${fontSize.t3}px`,
                lineHeight: lineHeight.t3,
                color: walherb.greenMid,
              }}
            >
              Buying from the USA has gotcha moments — duties, shipping delays,
              fakes. Here&apos;s exactly how Walherb removes every one of them.
            </Typography>
          </Box>

          {/* CTA card */}
          <Box
            sx={{
              backgroundColor: walherb.greenCard,
              border: `1px solid ${walherb.greenCardBorder}`,
              borderRadius: `${radius.radius24}px`,
              p: `${spacing.s20}px`,
              display: 'flex',
              flexDirection: 'column',
              gap: `${spacing.s32}px`,
              maxWidth: 320,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s2}px` }}>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: `${fontSize.t2}px`,
                  lineHeight: lineHeight.t2,
                  color: '#FCFBF6',
                }}
              >
                Still have questions?
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.regular,
                  fontSize: `${fontSize.b2}px`,
                  lineHeight: lineHeight.b2,
                  color: '#E8E7E2',
                }}
              >
                Our India support team replies in under 2 minutes during business
                hours.
              </Typography>
            </Box>
            <Box
              component="button"
              sx={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: 'none',
                borderRadius: `${radius.radiusFull}px`,
                py: `${spacing.s12}px`,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#F5F5F5' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: `${fontSize.b3}px`,
                  lineHeight: lineHeight.b3,
                  color: walherb.greenCard,
                  textAlign: 'center',
                }}
              >
                Contact us
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right column — accordion */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: `${spacing.s12}px`,
            width: { xs: '100%', md: 800 },
          }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FaqSection;
