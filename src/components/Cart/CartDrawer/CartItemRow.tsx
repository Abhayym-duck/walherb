'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';
import type { CartItem } from '../../../context/CartContext';
import { useShipTo } from '../../../context/ShipToContext';

const InternationalShippingTag = () => (
  <svg width="164" height="33" viewBox="0 0 164 33" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
    <rect width="136" height="33" fill="#1F322A"/>
    <path d="M164 0H136V28L164 0Z" fill="#1F322A"/>
    <path d="M164 33H136V5L164 33Z" fill="#1F322A"/>
    <text x="8" y="16.5" dominantBaseline="middle" fill="white" fontFamily="'DM Sans', sans-serif" fontWeight="500" fontSize="12">International Shipping</text>
  </svg>
);

function getDefaultDeliveryRange(): string {
  const base = new Date();
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const e = new Date(base); e.setDate(base.getDate() + 10);
  const l = new Date(base); l.setDate(base.getDate() + 12);
  return `${fmt(e)} – ${fmt(l)}`;
}

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}

export const CartItemRow = ({ item, onRemove, onQtyChange }: CartItemRowProps) => {
  const { formatPrice } = useShipTo();
  const savings = item.originalValue - item.priceValue;
  const deliveryRange = getDefaultDeliveryRange();

  return (
    <Box sx={{
      display: 'flex',
      gap: '12px',
      pb: '16px',
      borderBottom: '1px solid #F0EEEE',
    }}>
      {/* Product image */}
      <Box sx={{ flexShrink: 0 }}>
        <Box
          component="img"
          src={item.product.image}
          alt={item.product.title}
          sx={{
            width: 80,
            height: 80,
            objectFit: 'contain',
            borderRadius: '10px',
            border: '1px solid #F0EEEE',
            backgroundColor: '#FAFAFA',
            p: '4px',
          }}
        />
      </Box>

      {/* Right content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        {/* Product name */}
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: '13px',
          lineHeight: '17px',
          color: '#3E3C42',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.product.title}
          {item.pkgLabel ? ` — ${item.pkgLabel}` : ''}
        </Typography>

        {/* International Shipping row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <InternationalShippingTag />
          <Typography sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: '12px',
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
            color: '#3371D5',
          }}>
            Estimate Delivery: {deliveryRange}, Delivering to India
          </Typography>
        </Box>

        {/* Price row */}
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

        {/* Duties badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

        {/* Qty controls + trash */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '2px' }}>
          {/* Trash */}
          <IconButton
            onClick={onRemove}
            size="small"
            aria-label="Remove item"
            sx={{
              color: '#6D6777',
              p: '4px',
              '&:hover': { color: '#E53935', backgroundColor: '#FFF0F0' },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Stepper */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #EBE8E4',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <Box
              component="button"
              onClick={() => item.qty > 1 && onQtyChange(item.qty - 1)}
              disabled={item.qty <= 1}
              aria-label="Decrease"
              sx={{
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'none',
                cursor: item.qty > 1 ? 'pointer' : 'not-allowed',
                opacity: item.qty > 1 ? 1 : 0.35,
                '&:hover:not(:disabled)': { backgroundColor: '#F5F5F5' },
              }}
            >
              <RemoveIcon sx={{ fontSize: 13, color: '#686E6B' }} />
            </Box>
            <Typography sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: '14px',
              color: '#3E3C42',
              minWidth: 28,
              textAlign: 'center',
            }}>
              {item.qty}
            </Typography>
            <Box
              component="button"
              onClick={() => onQtyChange(item.qty + 1)}
              aria-label="Increase"
              sx={{
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'none',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#F5F5F5' },
              }}
            >
              <AddIcon sx={{ fontSize: 13, color: '#686E6B' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItemRow;
