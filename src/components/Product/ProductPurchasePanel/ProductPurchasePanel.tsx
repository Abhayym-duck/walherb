'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useCart, type CheckoutPayload } from '../../../context/CartContext';
import { useShipTo } from '../../../context/ShipToContext';
import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../../../design-system/tokens/typography';
import type { Product } from '../../home/ProductCard';
import { QuantitySelector } from './QuantitySelector';
import { DeliveryEstimator } from './DeliveryEstimator';
import { TrustBadges } from './TrustBadges';
import { PaymentMethods } from './PaymentMethods';
import { SoldByModal } from '../SoldByModal';
import { QuickPayBadge } from '../../payments/QuickPayBadge';

// Figma CDN asset URLs — valid 7 days from generation

export interface PackageOption {
  label: string;
  price: string;
  originalPrice: string;
  priceValue: number;
  originalValue: number;
  inventory: number;
  sku: string;
  best: boolean;
}

interface ProductPurchasePanelProps {
  product: Product;
  pkg: PackageOption;
  onBuyNow?: (payload: CheckoutPayload) => void;
}

export const ProductPurchasePanel = ({
  product,
  pkg,
  onBuyNow,
}: ProductPurchasePanelProps) => {
  const { addItem, openDrawer } = useCart();
  const { formatPrice } = useShipTo();
  const [qty, setQty] = useState(1);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [addCartStatus, setAddCartStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [soldByOpen, setSoldByOpen] = useState(false);

  const savings     = pkg.originalValue - pkg.priceValue;
  const savingsPct  = Math.round((savings / pkg.originalValue) * 100);
  const isOutOfStock = pkg.inventory === 0;
  const isLowStock   = pkg.inventory > 0 && pkg.inventory <= 3;
  const maxQty       = Math.max(1, pkg.inventory);

  useEffect(() => {
    setQty(q => Math.min(q, maxQty));
    setCheckoutError(null);
  }, [maxQty]);

  const validate = (): string | null => {
    if (isOutOfStock) return 'This item is currently out of stock.';
    if (qty < 1)       return 'Please select at least 1 item.';
    if (qty > pkg.inventory) return `Only ${pkg.inventory} unit${pkg.inventory === 1 ? '' : 's'} available.`;
    return null;
  };

  const handleBuyNow = () => {
    const err = validate();
    if (err) { setCheckoutError(err); return; }
    setCheckoutError(null);
    setBuyNowLoading(true);
    setTimeout(() => {
      setBuyNowLoading(false);
      addItem({
        product,
        pkgIdx: 0,
        pkgLabel: pkg.label,
        priceValue: pkg.priceValue,
        originalValue: pkg.originalValue,
        formattedPrice: formatPrice(pkg.priceValue),
        qty,
        sku: pkg.sku,
      });
      openDrawer();
      // Also notify parent (e.g. App.tsx) if a handler is wired
      onBuyNow?.({
        product,
        pkgIdx: 0,
        pkgLabel: pkg.label,
        priceValue: pkg.priceValue,
        originalValue: pkg.originalValue,
        formattedPrice: formatPrice(pkg.priceValue),
        qty,
        sku: pkg.sku,
      });
    }, 800);
  };

  const handleAddToCart = () => {
    const err = validate();
    if (err) { setCheckoutError(err); return; }
    setCheckoutError(null);
    setAddCartStatus('adding');
    setTimeout(() => {
      addItem({
        product,
        pkgIdx: 0,
        pkgLabel: pkg.label,
        priceValue: pkg.priceValue,
        originalValue: pkg.originalValue,
        formattedPrice: formatPrice(pkg.priceValue),
        qty,
        sku: pkg.sku,
      });
      setAddCartStatus('added');
      openDrawer();
      setTimeout(() => setAddCartStatus('idle'), 2000);
    }, 600);
  };

  return (
    <>
      <Box sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #F0EEEE',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ── Header ─────────────────────────────────────────── */}
        <Box sx={{
          backgroundColor: '#1F322A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: '12px',
        }}>
          <Typography sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '18.2px',
            color: '#E6EFEB',
          }}>
            Secure Checkout
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', p: '16px' }}>

          {/* ── Price + stock ───────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              {/* Price */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Typography sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '31.2px',
                    color: '#3E3E3C',
                  }}>
                    {formatPrice(pkg.priceValue)}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    color: '#B5B0B0',
                    textDecoration: 'line-through',
                  }}>
                    {formatPrice(pkg.originalValue)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <Box sx={{
                    backgroundColor: '#FAF3E8',
                    borderRadius: '50px',
                    px: '8px',
                    py: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <BoltIcon sx={{ fontSize: 10, color: '#AC873E' }} />
                    <Typography sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: '10px',
                      color: '#AC873E',
                      whiteSpace: 'nowrap',
                    }}>
                      Duties &amp; Taxes Included
                    </Typography>
                  </Box>
                  {savings > 0 && (
                    <Box sx={{
                      backgroundColor: '#EFFCF3',
                      borderRadius: '50px',
                      px: '8px',
                      py: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}>
                      <Typography sx={{
                        fontFamily: fontFamily.sans,
                        fontWeight: fontWeight.semiBold,
                        fontSize: '10px',
                        color: '#29713C',
                        whiteSpace: 'nowrap',
                      }}>
                        Save {savingsPct}% ({formatPrice(savings)})
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              {/* Stock */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '6px', flexShrink: 0 }}>
                {isOutOfStock ? (
                  <>
                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#E53935' }} />
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '10px', color: '#E53935', whiteSpace: 'nowrap' }}>Out of Stock</Typography>
                  </>
                ) : isLowStock ? (
                  <>
                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#F5A623' }} />
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '10px', color: '#F5A623', whiteSpace: 'nowrap' }}>Only {pkg.inventory} left</Typography>
                  </>
                ) : (
                  <>
                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#29713C' }} />
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '10px', color: '#433C50', whiteSpace: 'nowrap' }}>In Stock</Typography>
                  </>
                )}
              </Box>
            </Box>

            {/* International Shipping badge row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <Box
                sx={{
                  backgroundColor: '#1F322A',
                  pl: '12px',
                  pr: '24px',
                  py: '7px',
                  clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%)',
                }}
              >
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#E6EFEB', whiteSpace: 'nowrap' }}>
                  International Shipping
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#3D3A42', whiteSpace: 'nowrap' }}>
                  Ships from outside India.
                </Typography>
                <Typography
                  component="button"
                  sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.medium,
                    fontSize: '12px',
                    color: '#3D3A42',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    p: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Learn more
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Delivery estimator (inline states) ────────────── */}
          <DeliveryEstimator shipsFrom="USA" partner="Shadowfax Delhivery" />

          {/* ── Divider ────────────────────────────────────────── */}
          <Box sx={{ borderTop: '1px solid #F0EEEE' }} />

          {/* ── Quantity ───────────────────────────────────────── */}
          <QuantitySelector
            value={qty}
            onChange={(v) => { setQty(v); setCheckoutError(null); }}
            min={1}
            max={maxQty}
            disabled={isOutOfStock}
          />
          {isLowStock && (
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '10px', color: '#F5A623', mt: '-8px' }}>
              Hurry — low stock!
            </Typography>
          )}

          {/* Inline error */}
          {checkoutError && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '8px', px: '10px', py: '8px' }}>
              <ErrorOutlineIcon sx={{ fontSize: 14, color: '#E53935', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#E53935' }}>
                {checkoutError}
              </Typography>
            </Box>
          )}

          {/* ── CTAs ───────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Buy Now */}
            <Box
              component="button"
              onClick={handleBuyNow}
              disabled={buyNowLoading || isOutOfStock}
              aria-label={isOutOfStock ? 'Out of stock' : 'Buy now'}
              sx={{
                backgroundColor: isOutOfStock ? '#CCCCCC' : '#1F322A',
                borderRadius: '12px',
                px: '32px',
                py: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                border: 'none',
                cursor: buyNowLoading || isOutOfStock ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'background-color 0.2s',
                '&:hover:not(:disabled)': { backgroundColor: '#29433A' },
              }}
            >
              {buyNowLoading ? (
                <CircularProgress size={18} sx={{ color: '#FFFFFF' }} />
              ) : (
                <>
                  <Typography sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: 'normal',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                  }}>
                    {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                  </Typography>
                  {!isOutOfStock && <QuickPayBadge />}
                </>
              )}
            </Box>

            {/* Add to Cart */}
            <Box
              component="button"
              onClick={handleAddToCart}
              disabled={addCartStatus === 'adding' || isOutOfStock}
              aria-label="Add to cart"
              sx={{
                backgroundColor: addCartStatus === 'added' ? '#EFFCF3' : '#D5A310',
                border: `1px solid ${addCartStatus === 'added' ? '#29713C' : '#D5A310'}`,
                borderRadius: '12px',
                px: '32px',
                py: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: addCartStatus === 'adding' || isOutOfStock ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                '&:hover:not(:disabled)': {
                  backgroundColor: addCartStatus === 'added' ? '#EFFCF3' : '#BE9012',
                  borderColor: addCartStatus === 'added' ? '#29713C' : '#BE9012',
                },
              }}
            >
              {addCartStatus === 'adding' ? (
                <CircularProgress size={16} sx={{ color: '#476D59' }} />
              ) : addCartStatus === 'added' ? (
                <>
                  <CheckIcon sx={{ fontSize: 16, color: '#29713C' }} />
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: '14px', color: '#29713C', whiteSpace: 'nowrap' }}>
                    Added to Cart
                  </Typography>
                </>
              ) : (
                <>
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: '14px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                    Add to Cart
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* ── Divider ────────────────────────────────────────── */}
          <Box sx={{ borderTop: '1px solid #F0EEEE' }} />

          {/* ── Seller info ─────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { label: 'Sold by:',            value: 'Oman Herbs',        showInfo: true  },
                { label: 'Delivered by:',        value: 'Walherb',           showInfo: false },
                { label: 'Customer service by:', value: 'Walherb',           showInfo: false },
                { label: 'Returns policy:',      value: '14 Day Returnable', showInfo: false },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', px: '4px', py: '2px' }}>
                  <Typography sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '15.6px',
                    color: '#7F7D75',
                    width: 150,
                    flexShrink: 0,
                  }}>
                    {row.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '15.6px',
                      color: '#7F7D75',
                    }}>
                      {row.value}
                    </Typography>
                    {row.showInfo && (
                      <Box
                        role="button"
                        aria-label="About Sold by"
                        tabIndex={0}
                        onClick={() => setSoldByOpen(true)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSoldByOpen(true); } }}
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '50%', '&:hover': { opacity: 0.65 } }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: 12, color: '#7F7D75' }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ px: '4px' }}>
              <Typography sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15.6px',
                color: '#7F7F79',
              }}>
                Walherb purchases this item on your behalf and handles shipping, customs, and support to India.
              </Typography>
            </Box>

            {/* Trust badges */}
            <TrustBadges />
          </Box>

          {/* ── Secure Payment ──────────────────────────────────── */}
          <PaymentMethods />
        </Box>
      </Box>

      <SoldByModal open={soldByOpen} onClose={() => setSoldByOpen(false)} />
    </>
  );
};

export default ProductPurchasePanel;
