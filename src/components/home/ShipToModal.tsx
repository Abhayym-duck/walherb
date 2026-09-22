'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';
import { useShipTo, type Country } from '../../context/ShipToContext';

// Light tint of the brand green, used for the "currently shipping to" card.
const GREEN_TINT_BG = 'rgba(71, 109, 89, 0.08)';
const GREEN_TINT_BORDER = 'rgba(71, 109, 89, 0.25)';

interface ShipToModalProps {
  open: boolean;
  onClose: () => void;
}

export const ShipToModal = ({ open, onClose }: ShipToModalProps) => {
  const { country, countries, setCountry } = useShipTo();
  const [query, setQuery] = useState('');

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handleSelect = (c: Country) => {
    setCountry(c.code);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ sx: { borderRadius: `${radius.radius16}px`, maxWidth: 480, width: '100%', m: 2 } }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: `${spacing.s24}px`, pb: `${spacing.s16}px` }}>
        <Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: `${fontSize.t1}px`, lineHeight: lineHeight.t1, color: walherb.textHeading }}>
            Ship to
          </Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b2}px`, lineHeight: lineHeight.b2, color: walherb.textSubtle, mt: `${spacing.s2}px` }}>
            {countries.length}+ destinations · prices update instantly
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close" size="small" sx={{ color: walherb.textSubtle }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: `${spacing.s24}px`, pb: `${spacing.s16}px` }}>
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries — e.g. UAE, Qatar, Australia"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: walherb.textSubtle }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: `${radius.radius12}px`,
              fontFamily: fontFamily.sans,
              fontSize: `${fontSize.b2}px`,
              backgroundColor: '#FFFFFF',
              '& fieldset': { borderColor: walherb.border },
              '&:hover fieldset': { borderColor: walherb.greenPrimary },
              '&.Mui-focused fieldset': { borderColor: walherb.greenPrimary },
            },
          }}
        />
      </Box>

      <Box sx={{ px: `${spacing.s24}px`, pb: `${spacing.s24}px`, display: 'flex', flexDirection: 'column', gap: `${spacing.s16}px`, maxHeight: 420, overflowY: 'auto' }}>
        {/* Currently shipping to */}
        <Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.b3}px`, color: walherb.textSubtle, letterSpacing: '0.06em', mb: `${spacing.s8}px` }}>
            CURRENTLY SHIPPING TO
          </Typography>
          <Box
            sx={{
              backgroundColor: GREEN_TINT_BG,
              border: `1px solid ${GREEN_TINT_BORDER}`,
              borderRadius: `${radius.radius12}px`,
              px: `${spacing.s16}px`,
              py: `${spacing.s12}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s12}px` }}>
              <Typography sx={{ fontSize: 24, lineHeight: 1 }}>{country.flag}</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.t3}px`, color: walherb.textHeading }}>
                {country.name}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: walherb.greenPrimary,
                color: '#FFFFFF',
                borderRadius: `${radius.radiusFull}px`,
                px: `${spacing.s10}px`,
                py: `${spacing.s4}px`,
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: `${fontSize.b4}px`,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              SELECTED
            </Box>
          </Box>
        </Box>

        {/* Popular / all countries */}
        <Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.b3}px`, color: walherb.textSubtle, letterSpacing: '0.06em', mb: `${spacing.s8}px` }}>
            POPULAR
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: `${spacing.s8}px`,
            }}
          >
            {filtered.length === 0 ? (
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b2}px`, color: walherb.textSubtle, gridColumn: '1 / -1', py: `${spacing.s16}px`, textAlign: 'center' }}>
                No countries match "{query}"
              </Typography>
            ) : (
              filtered.map((c) => {
                const selected = c.code === country.code;
                return (
                  <Box
                    key={c.code}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(c)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(c); }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: `${spacing.s8}px`,
                      px: `${spacing.s12}px`,
                      py: `${spacing.s10}px`,
                      borderRadius: `${radius.radius8}px`,
                      border: `1px solid ${selected ? walherb.greenPrimary : walherb.border}`,
                      backgroundColor: selected ? GREEN_TINT_BG : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, background-color 0.15s',
                      '&:hover': { borderColor: walherb.greenPrimary },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s10}px`, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</Typography>
                      <Typography
                        sx={{
                          fontFamily: fontFamily.sans,
                          fontWeight: fontWeight.medium,
                          fontSize: `${fontSize.b2}px`,
                          color: walherb.textPrimary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {c.name}
                      </Typography>
                    </Box>
                    {selected && <CheckIcon sx={{ fontSize: 16, color: walherb.greenPrimary, flexShrink: 0 }} />}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>

      {/* Sticky footer */}
      <Box
        sx={{
          borderTop: `1px solid ${walherb.border}`,
          backgroundColor: walherb.bgSection,
          px: `${spacing.s24}px`,
          py: `${spacing.s12}px`,
          display: 'flex',
          alignItems: 'center',
          gap: `${spacing.s8}px`,
        }}
      >
        <FiberManualRecordIcon sx={{ fontSize: 10, color: walherb.greenPrimary }} />
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b3}px`, color: walherb.textSubtle }}>
          Shipping to {country.name}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default ShipToModal;
