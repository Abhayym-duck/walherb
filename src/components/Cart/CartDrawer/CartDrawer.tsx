'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

import { useCart } from '../../../context/CartContext';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';
import { CartItemRow } from './CartItemRow';
import { CartNotice } from './CartNotice';
import { PromoCode } from './PromoCode';
import { OrderSummary } from './OrderSummary';
import { CheckoutActions } from './CheckoutActions';


interface CartDrawerProps {
  onProceedToCheckout?: () => void;
  onQuickCheckout?: () => void;
}

export const CartDrawer = ({ onProceedToCheckout, onQuickCheckout }: CartDrawerProps) => {
  const { items, removeItem, updateQty, totalItems, totalValue, drawerOpen, closeDrawer } = useCart();
  const isEmpty = items.length === 0;

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: '480px', md: '520px' },
          maxWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.45)' },
        },
      }}
    >
      {/* ── Fixed header ──────────────────────────────────────────────── */}
      <Box sx={{
        backgroundColor: '#1F322A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '16px',
        py: '14px',
        flexShrink: 0,
      }}>
        {/* Left: close + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton
            onClick={closeDrawer}
            size="small"
            aria-label="Close cart"
            sx={{ color: '#FFFFFF', p: '4px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.bold,
            fontSize: '16px',
            color: '#FFFFFF',
            lineHeight: 'normal',
          }}>
            My Cart
          </Typography>
          {totalItems > 0 && (
            <Box sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50px',
              px: '8px',
              py: '2px',
              minWidth: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: '12px',
                color: '#FFFFFF',
                lineHeight: 'normal',
              }}>
                {totalItems}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right: Ship to India chip */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#43564E',
          border: '1px solid #4D6058',
          borderRadius: '24px',
          px: '16px',
          py: '8px',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#3D4F47' },
        }}>
          <DirectionsBoatIcon sx={{ fontSize: 14, color: '#E6EFEB' }} />
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '14px',
            lineHeight: '19.6px',
            color: '#E6EFEB',
            whiteSpace: 'nowrap',
          }}>
            Ship to India
          </Typography>
        </Box>
      </Box>

      {/* ── Scrollable body ──────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {isEmpty ? (
          // Empty state
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            py: '80px',
            px: '32px',
          }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingCartOutlinedIcon sx={{ fontSize: 28, color: '#CCCCCC' }} />
            </Box>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.bold,
                fontSize: '16px',
                color: '#3E3C42',
              }}>
                Your cart is empty
              </Typography>
              <Typography sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: '13px',
                color: '#6D6777',
              }}>
                Add items to get started
              </Typography>
            </Box>
            <Box
              component="button"
              onClick={closeDrawer}
              sx={{
                backgroundColor: '#1F322A',
                border: 'none',
                borderRadius: '10px',
                px: '24px',
                py: '12px',
                cursor: 'pointer',
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: '14px',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#29433A' },
              }}
            >
              Continue Shopping
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Cart items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0', px: '16px', pt: '16px' }}>
              {items.map((item) => (
                <CartItemRow
                  key={`${item.product.id}-${item.pkgIdx}`}
                  item={item}
                  onRemove={() => removeItem(item.product.id, item.pkgIdx)}
                  onQtyChange={(qty) => updateQty(item.product.id, item.pkgIdx, qty)}
                />
              ))}
            </Box>

            {/* Special Notice */}
            <Box sx={{ px: '16px', pt: '16px' }}>
              <CartNotice />
            </Box>

            <Divider sx={{ mx: '16px', mt: '16px', borderColor: '#F0EEEE' }} />

            {/* Promo Code */}
            <Box sx={{ px: '16px', pt: '16px' }}>
              <PromoCode />
            </Box>

            <Divider sx={{ mx: '16px', mt: '16px', borderColor: '#F0EEEE' }} />

            {/* Order Summary */}
            <Box sx={{ px: '16px', pt: '16px' }}>
              <OrderSummary
                itemCount={totalItems}
                itemsTotal={totalValue}
              />
            </Box>

            <Divider sx={{ mx: '16px', mt: '16px', borderColor: '#F0EEEE' }} />

            {/* Checkout Actions */}
            <Box sx={{ px: '16px', py: '16px' }}>
              <CheckoutActions
                onProceedToCheckout={onProceedToCheckout}
                onQuickCheckout={onQuickCheckout}
                disabled={isEmpty}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
