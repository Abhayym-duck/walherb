'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import type { Order, OrderPackage } from './OrdersPage';

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const CARRIER_NAME = 'Walherb Global Logistics';

const FAQ_ITEMS = [
  {
    q: 'Where is my order?',
    a: 'You can track your order using the tracking number provided above. Click the tracking number to copy it and enter it on the carrier\'s website for real-time updates.',
  },
  {
    q: 'What if my package is delayed?',
    a: '',
  },
  {
    q: 'Can I change my delivery address after shipping?',
    a: '',
  },
  {
    q: 'What should I do if my order is lost?',
    a: '',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

interface TrackingHistoryPageProps {
  order: Order;
  pkg: OrderPackage;
  onBack: () => void;
  onRequestReturn?: () => void;
}

export const TrackingHistoryPage = ({ pkg, onBack, onRequestReturn }: TrackingHistoryPageProps) => {
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const isDelivered = pkg.status === 'Delivered';
  const allProducts = pkg.products;

  const handleCopy = () => {
    navigator.clipboard.writeText(pkg.trackingNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(e) => { if (e.key === 'Enter') onBack(); }}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid #E3E6EC', cursor: 'pointer',
            '&:hover': { backgroundColor: '#F7F8FB' },
            flexShrink: 0,
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18, color: '#474743' }} />
        </Box>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '22px', lineHeight: '28.6px', color: '#474743' }}>
          Order Tracking Details
        </Typography>
      </Box>

      {/* Two-column layout */}
      <Box sx={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
        {/* Left column — tracking info */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <Box
            sx={{
              border: '1px solid #E3E6EC',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Tracking number row */}
            <Box
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '8px',
                backgroundColor: '#F7F8FB', border: '1px solid #E3E6EC',
                borderRadius: '8px', mx: '16px', mt: '16px', px: '16px', py: '12px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#474743' }}>
                  Tracking Number:
                </Typography>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#2D6A1F' }}>
                  {pkg.trackingNumber}
                </Typography>
              </Box>
              <Box
                role="button"
                tabIndex={0}
                onClick={handleCopy}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCopy(); }}
                sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', px: '8px', py: '4px', borderRadius: '6px', '&:hover': { backgroundColor: '#E3E6EC' } }}
              >
                <ContentCopyIcon sx={{ fontSize: 16, color: '#2D6A1F' }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#2D6A1F' }}>
                  {copied ? 'Copied!' : 'Copy'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Summary: carrier + estimated / delivered date */}
              <Box sx={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79' }}>
                    Carrier
                  </Typography>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', lineHeight: '20.8px', color: '#474743' }}>
                    {pkg.carrier ?? CARRIER_NAME}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79' }}>
                    {pkg.deliveredOn ? 'Delivered On' : 'Estimated Delivery'}
                  </Typography>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', lineHeight: '20.8px', color: '#474743' }}>
                    {pkg.deliveredOn ?? pkg.eta ?? '—'}
                  </Typography>
                </Box>
              </Box>

              {/* Returns & Refunds link for delivered orders */}
              {isDelivered && onRequestReturn && (
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={onRequestReturn}
                  onKeyDown={(e) => { if (e.key === 'Enter') onRequestReturn(); }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #E3E6EC',
                    borderRadius: '8px',
                    px: '16px',
                    py: '10px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    '&:hover': { backgroundColor: '#F7F8FB' },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.semiBold,
                      fontSize: '14px',
                      color: '#5A6454',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Returns & Refunds
                  </Typography>
                </Box>
              )}

              {/* Product thumbnails */}
              <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {allProducts.map((product, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 80, height: 80,
                      border: '1px solid #E3E6EC', borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      p: '8px', flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Divider */}
              <Box sx={{ borderBottom: '1px solid #E3E6EC' }} />

              {/* Status header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LocalShippingIcon sx={{ fontSize: 24, color: '#433C50' }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '24px', color: '#433C50' }}>
                  {isDelivered ? 'Delivered' : pkg.status}
                </Typography>
              </Box>

              {/* Timeline */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0px', pl: '4px' }}>
                {pkg.events.map((event, i) => {
                  const isFirst = i === 0;
                  const isLast = i === pkg.events.length - 1;
                  return (
                    <Box key={i} sx={{ display: 'flex', gap: '12px' }}>
                      {/* Dot + connector column */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        {/* Dot */}
                        <Box
                          sx={{
                            width: 18, height: 18,
                            borderRadius: '50%',
                            border: `3px solid ${isFirst ? '#2D6A1F' : '#E3E6EC'}`,
                            backgroundColor: '#FFFFFF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8, height: 8,
                              borderRadius: '50%',
                              backgroundColor: isFirst ? '#2D6A1F' : '#C5C5C5',
                            }}
                          />
                        </Box>
                        {/* Connector line */}
                        {!isLast && (
                          <Box sx={{ width: '2px', flex: 1, minHeight: '24px', backgroundColor: '#E3E6EC' }} />
                        )}
                      </Box>

                      {/* Event content */}
                      <Box sx={{ pb: isLast ? 0 : '20px', pt: '1px', flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: isFirst ? fontWeight.semiBold : fontWeight.regular,
                            fontSize: '14px',
                            color: isFirst ? '#2D6A1F' : '#474743',
                            lineHeight: '18.2px',
                          }}
                        >
                          {event.status}
                          {event.description ? ` · ${event.description}` : ''}
                        </Typography>
                        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#7F7F79', mt: '2px' }}>
                          {event.date}{event.location ? ` · ${event.location}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right column — FAQ */}
        <Box sx={{ width: { xs: '100%', lg: 340 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '22px', lineHeight: '28.6px', color: '#474743' }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQ_ITEMS.map((item, i) => {
              const isExpanded = expandedFaq === i;
              return (
                <Box
                  key={i}
                  sx={{
                    backgroundColor: '#F7F7F7',
                    border: '1px solid #EDEDED',
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedFaq(isExpanded ? null : i)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setExpandedFaq(isExpanded ? null : i); }}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      px: '24px', py: '20px', cursor: 'pointer',
                    }}
                  >
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#474743', flex: 1, pr: '12px' }}>
                      {item.q}
                    </Typography>
                    {isExpanded
                      ? <RemoveIcon sx={{ fontSize: 18, color: '#474743', flexShrink: 0 }} />
                      : <AddIcon sx={{ fontSize: 18, color: '#474743', flexShrink: 0 }} />
                    }
                  </Box>
                  {isExpanded && item.a && (
                    <Box sx={{ px: '24px', pb: '20px' }}>
                      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#7F7F79', lineHeight: '19.6px' }}>
                        {item.a}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TrackingHistoryPage;
