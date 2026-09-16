'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Category content sections.
//   • Generic, schema-driven blocks (InfoBlockList, SpecTable, TextBlock,
//     BulletList) — used by Travel/Generic and the 7 schema-driven categories.
//   • Supplement-bespoke blocks (FeaturesSection, ImportantInfoSection) extracted
//     verbatim so the supplement page stays pixel-identical.
// Every block returns `null` when its data is empty → sections never show blank
// labels (empty-state requirement).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';

import { fontFamily, fontWeight, fontSize, lineHeight } from '../../../design-system/tokens/typography';
import type { InfoBlock, SpecRow, FeatureItem } from '../types';

const poppins = "'Poppins', sans-serif";

// ─── Generic: titled-paragraph list (Benefits, Safety, How To Use, Feeding…) ─────

export const InfoBlockList = ({ title, blocks }: { title: string; blocks?: InfoBlock[] }) => {
  if (!blocks?.length) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: 500, fontSize: '18px', lineHeight: '23.4px', color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Box sx={{ px: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {blocks.map((item) => (
          <Box key={item.title} sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '14px', lineHeight: 'normal', color: '#252D28' }}>
              {item.title}
            </Typography>
            <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '16px', color: '#5A615D' }}>
              {item.body}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Generic: label/value spec table (Specifications, Dimensions, Nutrition…) ─────

export const SpecTable = ({ title, rows }: { title: string; rows?: SpecRow[] }) => {
  if (!rows?.length) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Box sx={{ px: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((row) => (
          <Box key={row.label} sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2px' }}>
            <Typography component="span" sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: '18px', color: '#252D28', flexShrink: 0, mr: '2px' }}>
              {row.label} -
            </Typography>
            <Typography component="span" sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '18px', color: '#5A615D' }}>
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Generic: single titled paragraph (Ingredients, Storage, Warranty, Expiry…) ──

export const TextBlock = ({ title, body }: { title: string; body?: string }) => {
  if (!body) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '18px', color: '#5A615D', px: '12px' }}>
        {body}
      </Typography>
    </Box>
  );
};

// ─── Generic: bulleted list (Package Contents, Skin Types, Certifications…) ───────

export const BulletList = ({ title, items }: { title: string; items?: string[] }) => {
  if (!items?.length) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Box sx={{ px: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <CheckIcon sx={{ fontSize: 14, color: '#476D59', flexShrink: 0, mt: '2px' }} />
            <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '18px', color: '#5A615D' }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Generic: chip row (Certifications, Skin/Hair types as pills) ─────────────────

export const ChipRow = ({ title, items }: { title: string; items?: string[] }) => {
  if (!items?.length) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Box sx={{ px: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((item) => (
          <Box key={item} sx={{ backgroundColor: '#F0F7F4', border: '1px solid #D5E5DD', borderRadius: '50px', px: '12px', py: '6px' }}>
            <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: 'normal', color: '#1F322A', whiteSpace: 'nowrap' }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Generic: feature checklist (two columns) — Highlights / Benefits ─────────────

export const FeatureChecklist = ({ title, features }: { title: string; features?: FeatureItem[] }) => {
  if (!features?.length) return null;
  const mid = Math.ceil(features.length / 2);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: { xs: '24px', md: '80px' }, px: '12px', flexWrap: 'wrap' }}>
        {[features.slice(0, mid), features.slice(mid)].map((col, ci) => (
          <Box key={ci} sx={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {col.map((f) => (
              <Box key={f.title} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckIcon sx={{ fontSize: 14, color: '#476D59', flexShrink: 0 }} />
                <Box>
                  <Typography component="span" sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', color: '#252D28' }}>{f.title}</Typography>
                  {f.desc && <Typography component="span" sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', color: '#5A615D' }}> - {f.desc}</Typography>}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Supplement bespoke: "Description" checklist + FDA box (verbatim) ─────────────

const FDA_NOTE =
  'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';

export const FeaturesSection = ({ features }: { features: FeatureItem[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
      Description
    </Typography>
    <Box sx={{ display: 'flex', gap: '80px', px: '12px' }}>
      {[features.slice(0, 4), features.slice(4)].map((col, ci) => (
        <Box key={ci} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {col.map((f) => (
            <Box key={f.title} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckIcon sx={{ fontSize: 14, color: '#476D59', flexShrink: 0 }} />
              <Box>
                <Typography component="span" sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', color: '#252D28' }}>{f.title}</Typography>
                <Typography component="span" sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', color: '#5A615D' }}> - {f.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
    <Box sx={{ backgroundColor: '#FFFCF7', border: '1px solid #FFEAC6', borderRadius: '8px', p: '14px' }}>
      <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: '15.6px', color: '#252D28' }}>
        {FDA_NOTE}
      </Typography>
    </Box>
  </Box>
);

// ─── Supplement bespoke: "Important Information" + disclaimer box (verbatim) ──────

const DISCLAIMER =
  'While we work to ensure that product information is correct, on occasion manufacturers may alter their ingredient lists. Actual product packaging and materials may contain more and/or different information than that shown on our Web site. We recommend that you do not solely rely on the information presented and that you always read labels, warnings, and directions before using or consuming a product. For additional information about a product, please contact the manufacturer. Content on this site is for reference purposes and is not intended to substitute for advice given by a physician, pharmacist, or other licensed health-care professional. You should not use this information as self-diagnosis or for treating a health problem or disease.';

export const ImportantInfoSection = ({ blocks }: { blocks: InfoBlock[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: 500, fontSize: '18px', lineHeight: '23.4px', color: '#3E3E3C' }}>
      Important Information
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box sx={{ px: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {blocks.map((item) => (
          <Box key={item.title} sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '14px', lineHeight: 'normal', color: '#252D28' }}>
              {item.title}
            </Typography>
            <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '16px', color: '#5A615D' }}>
              {item.body}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ backgroundColor: '#FFFCF7', border: '1px solid #FFEAC6', borderRadius: '8px', p: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: 'normal', color: '#252D28', whiteSpace: 'nowrap' }}>
          ⚠️ Disclaimer:
        </Typography>
        <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '16px', color: '#252D28' }}>
          {DISCLAIMER}
        </Typography>
      </Box>
    </Box>
  </Box>
);
