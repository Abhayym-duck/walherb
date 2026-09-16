'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import type { Order, OrderProduct } from './OrdersPage';

// ─── Constants ────────────────────────────────────────────────────────────────

// Shared width for the "Return Quantity" column header and every quantity cell,
// so the vertical divider and row borders line up across the whole table.
// 180px per Figma (products column 754 + quantity column 180 = 934).
const QTY_COL_WIDTH = 180;

const RETURN_REASONS = [
  'Product Expiration',
  'Product Reaction',
  'No longer Needed',
  'Item Missing',
  'Product Leaked / Melted',
  'Wrong Item was sent',
  'Damaged product',
];

// ─── Types ────────────────────────────────────────────────────────────────────

type ReturnStep = 1 | 2 | 3;
type RefundOption = 'refund' | 'replacement';

interface ItemState {
  checked: boolean;
  returnQty: number;
  reason: string;
}

export interface ReturnRequestPageProps {
  order: Order;
  onBack: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  return Number(priceStr.replace(/[₹,]/g, '')) || 0;
}

function allProducts(order: Order): OrderProduct[] {
  return order.packages.flatMap((p) => p.products);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const StepOrderedLabel = ({
  number,
  label,
  style,
}: {
  number: 1 | 2 | 3;
  label: string;
  style?: React.CSSProperties;
}) => (
  <ol
    start={number}
    style={{
      margin: 0,
      padding: 0,
      listStyle: 'decimal',
      fontFamily: fontFamily.sans,
      fontWeight: fontWeight.semiBold,
      fontSize: 14,
      color: '#1A1F1A',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <li style={{ marginLeft: 21, lineHeight: '19.6px' }}>{label}</li>
  </ol>
);

const QuantityStepper = ({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #EBE8E4',
      borderRadius: '8px',
      px: '8px',
      py: '4px',
    }}
  >
    <Box
      component="button"
      onClick={() => onChange(Math.max(1, value - 1))}
      sx={{
        width: 20,
        height: 20,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        borderRadius: '3.333px',
        '&:hover': { backgroundColor: '#F7F8FB' },
      }}
    >
      <RemoveIcon sx={{ fontSize: 12, color: '#686E6B' }} />
    </Box>
    <Box sx={{ width: 24, textAlign: 'center' }}>
      <Typography
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: 16,
          color: '#686E6B',
          lineHeight: 'normal',
        }}
      >
        {value}
      </Typography>
    </Box>
    <Box
      component="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      sx={{
        width: 20,
        height: 20,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        borderRadius: '3.333px',
        '&:hover': { backgroundColor: '#F7F8FB' },
      }}
    >
      <AddIcon sx={{ fontSize: 12, color: '#686E6B' }} />
    </Box>
  </Box>
);

const MENU_MAX_HEIGHT = 260;

interface MenuPosition {
  left: number;
  width: number;
  rectTop: number;
  rectBottom: number;
  openUp: boolean;
}

type ResponsiveWidth = number | string | Record<string, number | string>;

const ReasonDropdown = ({
  value,
  open,
  onOpen,
  onClose,
  onSelect,
  width = { xs: '100%', sm: 380 },
}: {
  value: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (reason: string) => void;
  width?: ResponsiveWidth;
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<MenuPosition | null>(null);

  // Keep the portalled menu anchored to the trigger while it's open. Because the
  // menu lives on document.body it can't be clipped by the card's overflow.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < MENU_MAX_HEIGHT && rect.top > spaceBelow;
      setPos({ left: rect.left, width: rect.width, rectTop: rect.top, rectBottom: rect.bottom, openUp });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  return (
    <Box sx={{ width, maxWidth: '100%' }}>
      <Box
        ref={triggerRef}
        onClick={open ? onClose : onOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9D9D9',
          borderRadius: '12px',
          px: '12px',
          py: '10px',
          cursor: 'pointer',
          gap: '8px',
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: 12,
            color: value ? '#3A3A3A' : '#97939E',
            flex: 1,
            lineHeight: '16.8px',
          }}
        >
          {value || 'Select reason'}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 14,
            color: '#433C50',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        />
      </Box>

      {open && pos && createPortal(
        <>
          {/* Transparent backdrop closes the menu on any outside click */}
          <Box onClick={onClose} sx={{ position: 'fixed', inset: 0, zIndex: 1400 }} />
          <Box
            sx={{
              position: 'fixed',
              left: pos.left,
              width: pos.width,
              ...(pos.openUp
                ? { bottom: window.innerHeight - pos.rectTop + 4 }
                : { top: pos.rectBottom + 4 }),
              zIndex: 1401,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E3E6EC',
              borderRadius: '8px',
              maxHeight: MENU_MAX_HEIGHT,
              overflowY: 'auto',
            }}
          >
            {RETURN_REASONS.map((reason, i) => (
              <Box
                key={reason}
                onClick={() => { onSelect(reason); onClose(); }}
                sx={{
                  px: '16px',
                  py: '12px',
                  borderBottom: i < RETURN_REASONS.length - 1 ? '1px solid #E3E6EC' : 'none',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#F7F8FB' },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.medium,
                    fontSize: 12,
                    color: '#41403B',
                    lineHeight: '16.8px',
                  }}
                >
                  {reason}
                </Typography>
              </Box>
            ))}
          </Box>
        </>,
        document.body,
      )}
    </Box>
  );
};

const SelectionBadge = ({ count }: { count: number }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      border: '1px solid #185FA5',
      borderRadius: '20px',
      px: '10px',
      py: '5px',
      backgroundColor: '#E8F0FB',
      flexShrink: 0,
    }}
  >
    <Box sx={{ width: 7, height: 7, backgroundColor: '#185FA5', borderRadius: '4px', flexShrink: 0 }} />
    <Typography
      sx={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: 11,
        color: '#185FA5',
        whiteSpace: 'nowrap',
      }}
    >
      {count === 0 ? 'No Item Selected' : `${count} ${count === 1 ? 'item' : 'items'} selected`}
    </Typography>
  </Box>
);

// Step accordion header styles
const stepHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  backgroundColor: '#F7F8FB',
  borderBottom: '1px solid #E3E6EC',
  borderLeft: '1px solid #E3E6EC',
  borderTop: '1px solid #E3E6EC',
  px: '20px',
  py: '14px',
  cursor: 'pointer',
};

// ─── Main component ──────────────────────────────────────────────────────────

export const ReturnRequestPage = ({ order, onBack }: ReturnRequestPageProps) => {
  const products = allProducts(order);

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<ReturnStep>(1);

  // Step 1 state
  const [items, setItems] = useState<ItemState[]>(() =>
    products.map((p) => ({ checked: false, returnQty: 1, reason: '' }))
  );
  // openDropdownIdx: index of per-item dropdown open, -1 = apply-all dropdown, null = none
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [comment, setComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [refundOption, setRefundOption] = useState<RefundOption>('refund');

  // Step 3 state
  const [confirmed, setConfirmed] = useState(false);

  // ── Derived values ─────────────────────────────────────────────────────────
  const selectedCount = items.filter((it) => it.checked).length;
  const allChecked = selectedCount === items.length;
  const estimatedRefund = items.reduce((sum, it, i) => {
    if (!it.checked) return sum;
    const unitPrice = parsePrice(products[i].unitPrice);
    return sum + unitPrice * it.returnQty;
  }, 0);

  const refundDisplay = estimatedRefund > 0
    ? `₹${estimatedRefund.toLocaleString('en-IN')}`
    : '—';

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleItem = (idx: number) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, checked: !it.checked } : it))
    );

  const toggleAll = () => {
    const next = !allChecked;
    setItems((prev) => prev.map((it) => ({ ...it, checked: next })));
  };

  const setQty = (idx: number, qty: number) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, returnQty: qty } : it)));

  const setItemReason = (idx: number, reason: string) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, reason } : it)));

  const applyReasonToAll = (reason: string) =>
    setItems((prev) => prev.map((it) => (it.checked ? { ...it, reason } : it)));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - photos.length);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).slice(0, 5 - photos.length);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const renderStep1Collapsed = () => (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Two-column header */}
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            ...stepHeaderSx,
            flex: 1,
            minWidth: 0,
            borderTopLeftRadius: '14px',
          }}
          onClick={() => setStep(1)}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StepOrderedLabel number={1} label="Which items can we help with?" />
          </Box>
        </Box>
        <Box
          sx={{
            ...stepHeaderSx,
            flexShrink: 0,
            borderTopRightRadius: '14px',
            gap: '16px',
          }}
          onClick={() => setStep(1)}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: 14,
              color: '#1A1F1A',
              whiteSpace: 'nowrap',
            }}
          >
            Return Quantity
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#433C50' }} />
        </Box>
      </Box>
      {/* Summary row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          pl: '12px',
          pr: '20px',
          py: '12px',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '12px',
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: 14,
            color: '#185FA5',
            flex: 1,
          }}
        >
          Estimated Refund:
        </Typography>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: 14,
            color: '#185FA5',
            whiteSpace: 'nowrap',
          }}
        >
          {refundDisplay}
        </Typography>
      </Box>
    </Box>
  );

  const renderStep1Expanded = () => (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {/* Two-column header */}
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            ...stepHeaderSx,
            flex: 1,
            minWidth: 0,
            borderTopLeftRadius: '14px',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StepOrderedLabel number={1} label="Which items can we help with?" />
          </Box>
        </Box>
        <Box
          sx={{
            ...stepHeaderSx,
            width: QTY_COL_WIDTH,
            flexShrink: 0,
            borderTopRightRadius: '14px',
            gap: '8px',
            px: '12px',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: 14,
              lineHeight: '19.6px',
              color: '#1A1F1A',
              whiteSpace: 'nowrap',
            }}
          >
            Return Quantity
          </Typography>
          <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#433C50', flexShrink: 0 }} />
        </Box>
      </Box>

      {/* Product rows — each item is ONE table row: [ product cell | quantity cell ] */}
      <Box>
        {products.map((product, i) => {
          const it = items[i];
          const isLast = i === products.length - 1;
          return (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                borderBottom: !isLast ? '1px solid #E3E6EC' : 'none',
              }}
            >
              {/* ── Product information cell ── */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  p: '8px',
                }}
              >
                {/* Info row: checkbox + image + product text */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
                  {/* Checkbox */}
                  <Box
                    component="button"
                    onClick={() => toggleItem(i)}
                    sx={{
                      border: 'none',
                      background: 'none',
                      p: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                      mt: '2px',
                    }}
                  >
                    {it.checked ? (
                      <CheckBoxIcon sx={{ fontSize: 16, color: '#185FA5' }} />
                    ) : (
                      <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, color: '#433C50' }} />
                    )}
                  </Box>

                  {/* Image + text */}
                  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Box
                      sx={{
                        width: 55,
                        height: 55,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: '8px',
                        flexShrink: 0,
                        border: '1px solid #F0F0F0',
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Typography
                        sx={{
                          fontFamily: fontFamily.sans,
                          fontWeight: fontWeight.semiBold,
                          fontSize: 14,
                          color: '#41403B',
                          lineHeight: '19.6px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.medium,
                            fontSize: 12,
                            color: '#7F7F79',
                            lineHeight: '16.8px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          QTY: {product.qty}
                        </Typography>
                        {product.unitPrice && (
                          <>
                            <Typography sx={{ fontFamily: fontFamily.sans, fontSize: 12, color: '#7F7F79', lineHeight: '16.8px' }}>
                              |
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: fontFamily.sans,
                                fontWeight: fontWeight.medium,
                                fontSize: 12,
                                color: '#7F7F79',
                                lineHeight: '16.8px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Unit Price:{' '}
                              <Box
                                component="span"
                                sx={{ fontWeight: fontWeight.semiBold }}
                              >
                                {product.unitPrice}
                              </Box>
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Per-item reason — aligns to the row's left edge (Figma) */}
                {it.checked && (
                  <Box sx={{ width: { xs: '100%', sm: 380 }, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Typography
                      sx={{
                        fontFamily: fontFamily.sans,
                        fontWeight: fontWeight.medium,
                        fontSize: 12,
                        color: '#433C50',
                        lineHeight: '16.8px',
                      }}
                    >
                      Reason for return
                    </Typography>
                    <ReasonDropdown
                      value={it.reason}
                      open={openDropdownIdx === i}
                      onOpen={() => setOpenDropdownIdx(i)}
                      onClose={() => setOpenDropdownIdx(null)}
                      onSelect={(reason) => { setItemReason(i, reason); setOpenDropdownIdx(null); }}
                      width="100%"
                    />
                  </Box>
                )}
              </Box>

              {/* ── Return quantity cell — shares this row's exact height ── */}
              <Box
                sx={{
                  width: QTY_COL_WIDTH,
                  flexShrink: 0,
                  borderLeft: '1px solid #E3E6EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: '8px',
                }}
              >
                {it.checked && (
                  <QuantityStepper
                    value={it.returnQty}
                    max={product.qty}
                    onChange={(v) => setQty(i, v)}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Select-all bar (Figma: #f7f8fb) + selection badge */}
      <Box
        sx={{
          backgroundColor: '#F7F8FB',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pl: '8px',
          pr: '20px',
          py: '12px',
          gap: '8px',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          {/* Select all row */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={toggleAll}
          >
            {allChecked && selectedCount > 0 ? (
              <CheckBoxIcon sx={{ fontSize: 16, color: '#185FA5' }} />
            ) : (
              <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, color: '#185FA5' }} />
            )}
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: 12,
                color: '#185FA5',
                lineHeight: '16.8px',
                whiteSpace: 'nowrap',
              }}
            >
              Select all
            </Typography>
          </Box>

          {/* Apply same reason to all — only shown when multiple items selected */}
          {selectedCount > 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: 12,
                  color: '#433C50',
                  lineHeight: '16.8px',
                }}
              >
                Apply same reason to all
              </Typography>
              <ReasonDropdown
                value=""
                open={openDropdownIdx === -1}
                onOpen={() => setOpenDropdownIdx(-1)}
                onClose={() => setOpenDropdownIdx(null)}
                onSelect={(reason) => { applyReasonToAll(reason); setOpenDropdownIdx(null); }}
              />
            </Box>
          )}
        </Box>

        <SelectionBadge count={selectedCount} />
      </Box>

      {/* Photo upload section */}
      {selectedCount > 0 && (
        <Box sx={{ px: '20px', pt: '16px', pb: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: 14,
              color: '#1A1F1A',
              lineHeight: '19.6px',
            }}
          >
            Please upload a clear photo of all affected items.
          </Typography>

          {/* Drop zone */}
          <Box
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              border: '1px dashed #CDCCD0',
              borderRadius: '10px',
              px: { xs: '16px', md: '40px' },
              py: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '28px',
              backgroundColor: '#FBFAFF',
              cursor: 'pointer',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />

            {/* Upload icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #F0F4FF 0%, #358740 54.808%, #1F322A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 22, color: '#FFFFFF' }} />
            </Box>

            {/* Upload text */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.bold ?? 700,
                  fontSize: { xs: 18, md: 22 },
                  color: '#000000',
                  whiteSpace: { xs: 'normal', md: 'nowrap' },
                  textAlign: 'center',
                }}
              >
                {photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? 's' : ''} selected` : 'Drag and drop file to import'}
              </Typography>

              <Box
                sx={{
                  backgroundColor: '#F0FEF4',
                  border: '1px solid #476D59',
                  borderRadius: '6px',
                  px: '24px',
                  py: '8px',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.medium,
                    fontSize: 18,
                    color: '#358740',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Choose File
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '11px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: 14,
                      color: '#6D6B77',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Maximum 5 photos
                  </Typography>
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: '#6D6B77',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: 14,
                      color: '#6D6B77',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    File Format: JPG, PNG or GIF
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.medium,
                    fontSize: 12,
                    color: '#ACAAB1',
                    textAlign: 'center',
                  }}
                >
                  Invalid images may result in a delayed or denied return request.{' '}
                  <Box
                    component="span"
                    sx={{
                      color: '#ACAAB1',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    Read our return policy for more information
                  </Box>
                  .
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Comment box */}
          <Box
            sx={{
              backgroundColor: '#F7F7F8',
              borderRadius: '8px',
              p: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: 12,
                color: '#433C50',
                lineHeight: '16.8px',
              }}
            >
              Add a comment{' '}
              <Box component="span" sx={{ color: '#97939E', fontSize: 10 }}>
                (Max 50 Characters)
              </Box>
            </Typography>
            <Box
              component="textarea"
              value={comment}
              maxLength={50}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              placeholder="Tell us anything that helps us review your request faster"
              rows={3}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FFFFFF',
                borderRadius: '8px',
                px: '12px',
                py: '8px',
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: 14,
                color: '#3A3A3A',
                resize: 'none',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                '&::placeholder': { color: '#B3B1B1' },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Estimated Refund row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          pl: '12px',
          pr: '20px',
          py: '12px',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '12px',
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: 14,
            color: '#185FA5',
            flex: 1,
          }}
        >
          Estimated Refund:
        </Typography>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: 14,
            color: '#185FA5',
            whiteSpace: 'nowrap',
          }}
        >
          {refundDisplay}
        </Typography>
      </Box>

      {/* Continue footer */}
      <Box
        sx={{
          borderTop: '1px solid #E3E6EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: '16px',
        }}
      >
        <Box
          component="button"
          disabled={selectedCount === 0}
          onClick={() => setStep(2)}
          sx={{
            backgroundColor: selectedCount === 0 ? '#9AAA92' : '#1F322A',
            border: 'none',
            borderRadius: '12px',
            px: '32px',
            py: '12px',
            cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { opacity: selectedCount === 0 ? 1 : 0.9 },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: 16,
              color: '#FFFFFF',
              lineHeight: '20.8px',
              whiteSpace: 'nowrap',
            }}
          >
            Continue
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderStep2Collapsed = () => (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          ...stepHeaderSx,
          flex: 1,
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          cursor: step > 2 ? 'pointer' : 'default',
        }}
        onClick={() => { if (step > 2) setStep(2); }}
      >
        <Box sx={{ flex: 1 }}>
          <StepOrderedLabel number={2} label="How can we help?" />
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#433C50', flexShrink: 0 }} />
      </Box>
    </Box>
  );

  const renderStep2Expanded = () => (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          ...stepHeaderSx,
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <StepOrderedLabel number={2} label="How can we help?" />
        </Box>
        <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#433C50', flexShrink: 0 }} />
      </Box>

      {/* Radio options */}
      <Box>
        {/* Option 1: Refund */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            px: '8px',
            py: '12px',
            borderBottom: '1px solid #E3E6EC',
            cursor: 'pointer',
          }}
          onClick={() => setRefundOption('refund')}
        >
          {refundOption === 'refund' ? (
            <RadioButtonCheckedIcon sx={{ fontSize: 16, color: '#185FA5', flexShrink: 0, mt: '1px' }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: '#CDCCD0', flexShrink: 0, mt: '1px' }} />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: 12,
                color: '#41403B',
                lineHeight: '16.8px',
              }}
            >
              Refund to original payment method
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: 12,
                color: '#7F7F79',
                lineHeight: '16.8px',
                mt: '4px',
              }}
            >
              Back to your card / original payment. Allow 7–10 business days (up to 35 days outside the US).
            </Typography>
          </Box>
        </Box>

        {/* Option 2: Replacement */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            px: '8px',
            py: '12px',
            cursor: 'pointer',
          }}
          onClick={() => setRefundOption('replacement')}
        >
          {refundOption === 'replacement' ? (
            <RadioButtonCheckedIcon sx={{ fontSize: 16, color: '#185FA5', flexShrink: 0, mt: '1px' }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: '#CDCCD0', flexShrink: 0, mt: '1px' }} />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: 12,
                color: '#41403B',
                lineHeight: '16.8px',
              }}
            >
              Replacement
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: 12,
                color: '#7F7F79',
                lineHeight: '16.8px',
                mt: '4px',
              }}
            >
              We'll ship the same item(s) again at no extra cost, subject to availability.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid #E3E6EC',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          p: '16px',
        }}
      >
        <Box
          component="button"
          onClick={() => setStep(1)}
          sx={{
            border: '1px solid #E3E6EC',
            borderRadius: '12px',
            px: '32px',
            py: '12px',
            width: { xs: '100%', md: 160 },
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { backgroundColor: '#F7F8FB' },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: 16,
              color: '#5A6454',
              lineHeight: '20.8px',
              whiteSpace: 'nowrap',
            }}
          >
            Back
          </Typography>
        </Box>
        <Box
          component="button"
          onClick={() => setStep(3)}
          sx={{
            backgroundColor: '#1F322A',
            border: 'none',
            borderRadius: '12px',
            px: '32px',
            py: '12px',
            width: { xs: '100%', md: 'auto' },
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: 16,
              color: '#FFFFFF',
              lineHeight: '20.8px',
              whiteSpace: 'nowrap',
            }}
          >
            Continue
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderStep3Collapsed = () => (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          ...stepHeaderSx,
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <StepOrderedLabel number={3} label="Ready to submit?" />
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#433C50', flexShrink: 0 }} />
      </Box>
    </Box>
  );

  const selectedProducts = products.filter((_, i) => items[i].checked);

  const renderStep3Expanded = () => (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          ...stepHeaderSx,
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <StepOrderedLabel number={3} label="Ready to submit?" />
        </Box>
        <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#433C50', flexShrink: 0 }} />
      </Box>

      {/* Product summary list */}
      <Box>
        {selectedProducts.map((product, i) => {
          const isLast = i === selectedProducts.length - 1;
          const itemIdx = products.indexOf(product);
          const it = itemIdx >= 0 ? items[itemIdx] : null;
          return (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                p: '8px',
                borderBottom: !isLast ? '1px solid #E3E6EC' : 'none',
              }}
            >
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: '8px',
                  flexShrink: 0,
                  border: '1px solid #F0F0F0',
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography
                  sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.semiBold,
                    fontSize: 14,
                    color: '#41403B',
                    lineHeight: '19.6px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: 12,
                      color: '#7F7F79',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    QTY: {it ? it.returnQty : product.qty}
                  </Typography>
                  {product.unitPrice && (
                    <>
                      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: 12, color: '#7F7F79' }}>|</Typography>
                      <Typography
                        sx={{
                          fontFamily: fontFamily.sans,
                          fontWeight: fontWeight.medium,
                          fontSize: 12,
                          color: '#7F7F79',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Unit Price:{' '}
                        <Box component="span" sx={{ fontWeight: fontWeight.semiBold }}>
                          {product.unitPrice}
                        </Box>
                      </Typography>
                    </>
                  )}
                </Box>
                {it && it.reason && (
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: 12,
                      color: '#7F7F79',
                      lineHeight: '16.8px',
                    }}
                  >
                    Reason:{' '}
                    <Box component="span" sx={{ fontWeight: fontWeight.semiBold, color: '#41403B' }}>
                      {it.reason}
                    </Box>
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Estimated Refund — blue bg */}
      <Box
        sx={{
          backgroundColor: '#E8F0FB',
          borderTop: '1px solid #E3E6EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          pl: '12px',
          pr: '20px',
          py: '12px',
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: 14,
            color: '#185FA5',
            flex: 1,
          }}
        >
          Estimated Refund:
        </Typography>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: 14,
            color: '#185FA5',
            whiteSpace: 'nowrap',
          }}
        >
          {refundDisplay}
        </Typography>
      </Box>

      {/* Info cards + confirmation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', p: '16px' }}>
        {/* Three info cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '16px', alignItems: 'stretch' }}>
          {[
            {
              title: 'Review',
              body: "We respond within 48 hours. You'll get an email once a decision is made.",
            },
            {
              title: 'Return window',
              body: 'If a return is required, ship it back in original condition within 14 days. Domestic labels are free.',
            },
            {
              title: 'Refund time',
              body: 'Processed once we receive the item(s) — 7–10 business days to your payment method.',
            },
          ].map((card) => (
            <Box
              key={card.title}
              sx={{
                flex: 1,
                border: '1px solid #E3E6EC',
                borderRadius: '12px',
                p: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.semiBold,
                  fontSize: 12,
                  color: '#41403B',
                  lineHeight: '16.8px',
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: 12,
                  color: '#7F7F79',
                  lineHeight: '16.8px',
                }}
              >
                {card.body}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Confirmation checkbox */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            py: '2px',
          }}
          onClick={() => setConfirmed((v) => !v)}
        >
          {confirmed ? (
            <CheckBoxIcon sx={{ fontSize: 16, color: '#185FA5', flexShrink: 0 }} />
          ) : (
            <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, color: '#433C50', flexShrink: 0 }} />
          )}
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: 14,
              color: '#41403B',
              lineHeight: '19.6px',
            }}
          >
            I confirm the details above are correct and have read the Refund Policy. Submitting a request does not guarantee approval
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid #E3E6EC',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          p: '16px',
        }}
      >
        <Box
          component="button"
          onClick={() => setStep(2)}
          sx={{
            border: '1px solid #E3E6EC',
            borderRadius: '12px',
            px: '32px',
            py: '12px',
            width: { xs: '100%', md: 160 },
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { backgroundColor: '#F7F8FB' },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: 16,
              color: '#5A6454',
              lineHeight: '20.8px',
              whiteSpace: 'nowrap',
            }}
          >
            Back
          </Typography>
        </Box>
        <Box
          component="button"
          disabled={!confirmed}
          onClick={() => {
            // Submission complete — navigate back to orders
            onBack();
          }}
          sx={{
            backgroundColor: confirmed ? '#1F322A' : '#9AAA92',
            border: 'none',
            borderRadius: '12px',
            px: '32px',
            py: '12px',
            width: { xs: '100%', md: 'auto' },
            cursor: confirmed ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { opacity: confirmed ? 0.9 : 1 },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: 16,
              color: '#FFFFFF',
              lineHeight: '20.8px',
              whiteSpace: 'nowrap',
            }}
          >
            Submit request
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Box
            component="button"
            onClick={onBack}
            sx={{
              border: 'none',
              background: 'none',
              p: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              flexShrink: 0,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20, color: '#474743' }} />
          </Box>
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: 22,
              lineHeight: '28.6px',
              color: '#474743',
            }}
          >
            Create Return Request
          </Typography>
        </Box>

        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: 14,
              color: '#433C50',
              lineHeight: '19.6px',
            }}
          >
            Quick Filters:
          </Typography>
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: 14,
              color: '#433C50',
              lineHeight: '19.6px',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={onBack}
          >
            Orders
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 16, color: '#433C50' }} />
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: 14,
              color: '#433C50',
              lineHeight: '19.6px',
            }}
          >
            Orders Issues
          </Typography>
        </Box>
      </Box>

      {/* Accordion steps */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Step 1 — horizontal scroll fallback on mobile so the fixed quantity
            column never forces page-level overflow on very narrow screens */}
        <Box sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
          {step === 1 ? renderStep1Expanded() : renderStep1Collapsed()}
        </Box>

        {/* Step 2 */}
        {step === 2 ? renderStep2Expanded() : renderStep2Collapsed()}

        {/* Step 3 */}
        {step === 3 ? renderStep3Expanded() : renderStep3Collapsed()}
      </Box>
    </Box>
  );
};

export default ReturnRequestPage;
