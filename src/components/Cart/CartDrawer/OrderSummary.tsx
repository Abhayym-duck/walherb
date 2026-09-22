'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';
import { useShipTo } from '../../../context/ShipToContext';

interface OrderSummaryProps {
  itemCount: number;
  /** Raw INR total, converted for display via ShipToContext. */
  itemsTotal: number;
}

const Row = ({
  label,
  value,
  valueColor,
  total,
}: {
  label: string;
  value: string;
  valueColor?: string;
  total?: boolean;
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography sx={{
      fontFamily: fontFamily.sans,
      fontWeight: total ? fontWeight.medium : fontWeight.semiBold,
      fontSize: total ? '18px' : '16px',
      lineHeight: total ? '23.4px' : '20.8px',
      color: '#3E3E3C',
    }}>
      {label}
    </Typography>
    <Typography sx={{
      fontFamily: fontFamily.sans,
      fontWeight: total ? fontWeight.medium : fontWeight.semiBold,
      fontSize: total ? '18px' : '16px',
      lineHeight: total ? '23.4px' : '20.8px',
      color: valueColor ?? '#3E3E3C',
    }}>
      {value}
    </Typography>
  </Box>
);

export const OrderSummary = ({ itemCount, itemsTotal }: OrderSummaryProps) => {
  const { formatPrice } = useShipTo();
  return (
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
      {/* Items total */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Row label={`Items Total (${itemCount})`} value={formatPrice(itemsTotal)} />
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
      </Box>

      <Row label="Shipping" value="Free" valueColor="#33944A" />
      <Row label="Duties & Taxes" value="--" />
    </Box>

    <Divider sx={{ borderColor: '#EBEBEB' }} />

    <Row label="Total amount" value={formatPrice(itemsTotal)} total />
  </Box>
  );
};

export default OrderSummary;
