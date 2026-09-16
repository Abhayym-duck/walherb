'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { getKyc, setKyc, type KycStatus, type KycDoc } from './kycStore';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPT = 'image/png,image/jpeg,application/pdf';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatToday = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateTime = () => {
  const d = new Date();
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${date}, ${time}`;
};

const genReference = () => `KYC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

const initialsOf = (name: string) =>
  (name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('') || 'WA').toUpperCase();

// ─── Routing helpers (/account/kyc, /account/kyc/status, /account/kyc/verified) ─

const urlForStatus = (s: KycStatus) =>
  s === 'verified' ? '/account/kyc/verified' : s === 'pending' ? '/account/kyc/status' : '/account/kyc';

const statusFromPath = (): KycStatus => {
  if (typeof window === 'undefined') return 'not-started';
  const p = window.location.pathname;
  if (p.endsWith('/account/kyc/verified')) return 'verified';
  if (p.endsWith('/account/kyc/status')) return 'pending';
  return 'not-started';
};

// ─── Shared styles ──────────────────────────────────────────────────────────────

const INPUT_SX = {
  width: '100%',
  border: '1px solid #D9D9D9',
  borderRadius: '12px',
  px: '12px',
  py: '12px',
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.regular,
  fontSize: '14px',
  lineHeight: '19.6px',
  color: '#433C50',
  outline: 'none',
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box' as const,
  '&::placeholder': { color: '#97939E' },
  '&:focus': { borderColor: '#476D59' },
} as const;

// ─── Form: status banner / why card / security badge ────────────────────────────

const FormBanner = () => (
  <Box sx={{ backgroundColor: '#FFF8EC', border: '1px solid #F5C842', borderRadius: '16px', p: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
    <WarningAmberIcon sx={{ fontSize: 28, color: '#B45309', flexShrink: 0, mt: '2px' }} />
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '6px', flexWrap: 'wrap' }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '20px', lineHeight: '26px', color: '#92400E' }}>
          Verification Required
        </Typography>
        <Box sx={{ backgroundColor: '#FEF3C7', borderRadius: '500px', px: '12px', py: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#92400E' }}>Not Submitted</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: '20px', color: '#92400E', opacity: 0.85 }}>
        Complete your one-time KYC to import international wellness products into India.
      </Typography>
    </Box>
  </Box>
);

const WHY_POINTS = [
  { title: 'We import on your behalf', body: 'Walherb sources and imports international wellness products directly into India. As the facilitating importer, we link each shipment to its recipient.' },
  { title: 'Indian customs regulations', body: 'The Customs Act and FEMA regulations require identity documentation (PAN + Aadhaar) for personal imports.' },
  { title: 'Faster clearance, fewer delays', body: 'With your verified identity on file, shipments clear customs faster — fewer holds and return-to-origin situations.' },
];

const WhyKYCCard = () => (
  <Box sx={{ backgroundColor: '#F7F8FB', border: '1px solid #E3E6EC', borderRadius: '16px', p: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: '#476D59', flexShrink: 0 }} />
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#474743' }}>
        Why is KYC required for my orders?
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {WHY_POINTS.map(({ title, body }) => (
        <Box key={title} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#476D59', mt: '7px', flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#433C50' }}>{title}</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: '20px', color: '#6D6777', mt: '2px' }}>{body}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

const SecurityBadge = () => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', px: '12px', py: '8px' }}>
    <LockOutlinedIcon sx={{ fontSize: 14, color: '#16A34A', flexShrink: 0 }} />
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#15803D' }}>
      Encrypted &amp; stored securely. Used only for customs verification.
    </Typography>
  </Box>
);

const SectionCard = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '16px', p: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#474743' }}>{title}</Typography>
      {action}
    </Box>
    {children}
  </Box>
);

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', lineHeight: '19.6px', color: '#433C50' }}>
      {label} <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
    </Typography>
    {children}
    {error && <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#FF4C51' }}>{error}</Typography>}
  </Box>
);

// ─── UploadZone (form) ──────────────────────────────────────────────────────────

interface UploadZoneProps {
  title: string;
  hint: string;
  file: KycDoc | null;
  onFile: (doc: KycDoc) => void;
  onRemove: () => void;
  error?: string;
}

const UploadZone = ({ title, hint, file, onFile, onRemove, error }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState('');

  const processFile = (f: File) => {
    if (f.size > MAX_SIZE) { setSizeError('File exceeds the 10 MB limit. Please upload a smaller file.'); return; }
    setSizeError('');
    const url = URL.createObjectURL(f);
    const ext = (f.name.split('.').pop() || '').toUpperCase();
    const fileType = ext === 'JPEG' ? 'JPG' : ext || (f.type.startsWith('image/') ? 'IMG' : 'FILE');
    onFile({ name: f.name, size: formatSize(f.size), url, isImage: f.type.startsWith('image/'), fileType, uploadedOn: formatToday() });
  };

  const shownError = error || sizeError;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#433C50' }}>
        {title} <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#6D6777' }}>{hint}</Typography>

      {file ? (
        <Box sx={{ border: '1px solid #E3E6EC', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F7F8FB', mt: '2px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '14px', py: '10px', borderBottom: '1px solid #E3E6EC' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: '#16A34A' }} />
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '13px', color: '#15803D' }}>Uploaded</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Box role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#476D59' }}>Replace</Typography>
              </Box>
              <Box role="button" tabIndex={0} onClick={() => { onRemove(); setSizeError(''); }} onKeyDown={(e) => { if (e.key === 'Enter') onRemove(); }} sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
                <CloseIcon sx={{ fontSize: 14, color: '#6D6777' }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#6D6777' }}>Remove</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {file.isImage ? (
              <Box component="img" src={file.url} alt="Document preview" sx={{ width: 80, height: 56, objectFit: 'cover', borderRadius: '8px', border: '1px solid #E3E6EC', flexShrink: 0 }} />
            ) : (
              <Box sx={{ width: 80, height: 56, borderRadius: '8px', border: '1px solid #E3E6EC', backgroundColor: '#E3E6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '11px', color: '#6D6777' }}>PDF</Typography>
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#433C50', wordBreak: 'break-all' }}>{file.name}</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#6D6777', mt: '2px' }}>{file.size}</Typography>
            </Box>
            <Box role="button" tabIndex={0} onClick={() => window.open(file.url, '_blank')} onKeyDown={(e) => { if (e.key === 'Enter') window.open(file.url, '_blank'); }} sx={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #E3E6EC', borderRadius: '8px', px: '12px', py: '8px', cursor: 'pointer', flexShrink: 0, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#EEF2F0' } }}>
              <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#5A6454' }} />
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#5A6454' }}>View</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: '2px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
            sx={{
              border: `1.5px dashed ${shownError ? '#FF4C51' : dragging ? '#3A5C49' : '#A9C5B2'}`,
              borderRadius: '12px', px: '20px', py: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: 'pointer', backgroundColor: dragging ? '#F0F7F4' : '#FFFFFF',
              transition: 'border-color 0.15s, background-color 0.15s',
              '&:hover': { borderColor: '#476D59', backgroundColor: '#F0F7F4' },
              '&:focus-visible': { outline: '2px solid #476D59', outlineOffset: '2px' },
            }}
          >
            <FileUploadOutlinedIcon sx={{ fontSize: 22, color: '#476D59' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '15px', color: '#476D59', whiteSpace: 'nowrap' }}>
              Drag or Click to Upload file
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '11px', color: '#97939E' }}>JPG, PNG, PDF · Max file size 10 MB</Typography>
        </Box>
      )}

      {shownError && <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#FF4C51' }}>{shownError}</Typography>}

      <input ref={inputRef} type="file" accept={ACCEPT} style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }} />
    </Box>
  );
};

// ─── KYC Status dashboard (pending + verified) ──────────────────────────────────

const KycStatusCard = ({ status }: { status: KycStatus }) => {
  const verified = status === 'verified';
  const accent = verified ? '#476D59' : '#B45309';
  const tint = verified ? '#EEF2F0' : '#FEF3C7';
  return (
    <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '16px', p: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <Box sx={{ width: 88, height: 88, borderRadius: '50%', border: `2px dashed ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Box sx={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {verified
            ? <VerifiedUserOutlinedIcon sx={{ fontSize: 30, color: accent }} />
            : <AccessTimeIcon sx={{ fontSize: 30, color: accent }} />}
        </Box>
      </Box>
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '24px', lineHeight: '31px', color: verified ? '#2D6A1F' : '#92400E' }}>
          {verified ? 'Verification complete' : 'Under review'}
        </Typography>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '15px', lineHeight: '21px', color: '#6D6777', mt: '4px' }}>
          {verified
            ? 'Your KYC has been verified. Import clearance can proceed.'
            : 'We are reviewing your submitted documents. Verification usually takes 24–48 hours.'}
        </Typography>
      </Box>
    </Box>
  );
};

type TimelineState = 'done' | 'current' | 'pending';
interface TimelineEvent { title: string; meta: string; state: TimelineState }

const buildTimeline = (status: KycStatus, submittedAt: string | null, verifiedAt: string | null): TimelineEvent[] => {
  if (status === 'verified') {
    return [
      { title: 'Documents submitted', meta: submittedAt ?? '—', state: 'done' },
      { title: 'Reviewed', meta: 'Checked by our verification team', state: 'done' },
      { title: 'Verification complete', meta: verifiedAt ?? '—', state: 'done' },
    ];
  }
  return [
    { title: 'Documents submitted', meta: submittedAt ?? '—', state: 'done' },
    { title: 'Under review', meta: 'Checked by our verification team', state: 'current' },
    { title: 'Verification complete', meta: 'Usually within 24–48 hours', state: 'pending' },
  ];
};

const Timeline = ({ events }: { events: TimelineEvent[] }) => (
  <Box>
    {events.map((e, i) => {
      const isLast = i === events.length - 1;
      const dotStyle =
        e.state === 'done'    ? { bg: '#E6F4EA', icon: <CheckIcon sx={{ fontSize: 16, color: '#2D6A1F' }} /> } :
        e.state === 'current' ? { bg: '#FEF3C7', icon: <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#B45309' }} /> } :
                                { bg: '#EEF0F2', icon: <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C5C5C5' }} /> };
      return (
        <Box key={i} sx={{ display: 'flex', gap: '12px' }}>
          {/* dot + connector */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: dotStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {dotStyle.icon}
            </Box>
            {!isLast && <Box sx={{ width: '2px', flex: 1, minHeight: '20px', backgroundColor: '#E3E6EC' }} />}
          </Box>
          {/* content */}
          <Box sx={{ pb: isLast ? 0 : '20px', pt: '3px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: e.state === 'pending' ? '#97939E' : '#1A1F1A' }}>
              {e.title}
            </Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#7F7F79', mt: '2px' }}>
              {e.meta}
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const CustomerDetails = ({ name, address, reference }: { name: string; address: string; reference: string }) => (
  <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0, backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '16px', p: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#474743' }}>
      Customer details
    </Typography>

    {/* Avatar + name */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Box sx={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#EEF0FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#476D59' }}>
          {initialsOf(name)}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#1A1F1A' }}>
          {name || 'Walherb Customer'}
        </Typography>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#7F7F79' }}>
          As per Aadhaar card
        </Typography>
      </Box>
    </Box>

    {/* Address */}
    <Box>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '11px', color: '#97939E', textTransform: 'uppercase', letterSpacing: '0.6px', mb: '6px' }}>
        Address
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: '20px', color: '#433C50' }}>
        {address}
      </Typography>
    </Box>

    {/* Reference */}
    <Box>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '11px', color: '#97939E', textTransform: 'uppercase', letterSpacing: '0.6px', mb: '6px' }}>
        Reference
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', letterSpacing: '0.4px', color: '#433C50' }}>
        {reference}
      </Typography>
    </Box>
  </Box>
);

// ─── DemoSwitcher (preview/simulate states — replace with backend later) ─────────

const DEMO_STATES: { key: KycStatus; label: string }[] = [
  { key: 'not-started', label: 'Form'         },
  { key: 'pending',     label: 'Under Review' },
  { key: 'verified',    label: 'Verified'     },
];

const DemoSwitcher = ({ current, onChange }: { current: KycStatus; onChange: (s: KycStatus) => void }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '11px', fontWeight: fontWeight.medium, color: '#97939E', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Preview:</Typography>
    {DEMO_STATES.map(({ key, label }) => {
      const isActive = current === key;
      return (
        <Box key={key} role="button" tabIndex={0} onClick={() => onChange(key)} onKeyDown={(e) => { if (e.key === 'Enter') onChange(key); }}
          sx={{ px: '10px', py: '4px', borderRadius: '500px', border: '1px solid #E3E6EC', cursor: 'pointer', backgroundColor: isActive ? '#476D59' : '#F7F8FB', '&:hover': { backgroundColor: isActive ? '#476D59' : '#EEF2F0' } }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '11px', color: isActive ? '#FFFFFF' : '#6D6777', whiteSpace: 'nowrap' }}>{label}</Typography>
        </Box>
      );
    })}
  </Box>
);

// ─── KYCPage ─────────────────────────────────────────────────────────────────

export const KYCPage = () => {
  const initial = getKyc();

  const [status, setStatus] = useState<KycStatus>(() =>
    initial.status !== 'not-started' ? initial.status : statusFromPath(),
  );
  const [fullName, setFullName] = useState(initial.fullName);
  const [panDoc, setPanDoc] = useState<KycDoc | null>(initial.panDoc);
  const [aadhaarDoc, setAadhaarDoc] = useState<KycDoc | null>(initial.aadhaarDoc);
  const [reference, setReference] = useState<string | null>(initial.reference);
  const [submittedAt, setSubmittedAt] = useState<string | null>(initial.submittedAt);
  const [verifiedAt, setVerifiedAt] = useState<string | null>(initial.verifiedAt);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const address = initial.address;

  useEffect(() => {
    const resolved = getKyc().status !== 'not-started' ? getKyc().status : statusFromPath();
    window.history.replaceState({}, '', urlForStatus(resolved));
    const onPop = () => setStatus(statusFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    setKyc({ status, fullName, panDoc, aadhaarDoc, reference, submittedAt, verifiedAt });
  }, [status, fullName, panDoc, aadhaarDoc, reference, submittedAt, verifiedAt]);

  const goStatus = (s: KycStatus) => {
    setStatus(s);
    window.history.pushState({}, '', urlForStatus(s));
  };

  const nameValid = fullName.trim().length > 0;
  const canSubmit = nameValid && !!panDoc && !!aadhaarDoc;

  const handleSubmit = () => {
    setAttempted(true);
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (!reference) setReference(genReference());
      setSubmittedAt(formatDateTime());
      goStatus('pending');
    }, 1000);
  };

  const handleApprove = () => { setVerifiedAt(formatDateTime()); goStatus('verified'); };
  const handleEdit = () => goStatus('not-started');

  const handleDemo = (s: KycStatus) => {
    if (s !== 'not-started') {
      if (!reference) setReference(genReference());
      if (!submittedAt) setSubmittedAt(formatDateTime());
    }
    if (s === 'verified' && !verifiedAt) setVerifiedAt(formatDateTime());
    goStatus(s);
  };

  const missing: string[] = [];
  if (!nameValid) missing.push('your full name');
  if (!panDoc) missing.push('PAN card');
  if (!aadhaarDoc) missing.push('Aadhaar card');

  const ref = reference ?? genReference();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page title + preview switcher */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '22px', lineHeight: '28.6px', color: '#474743' }}>
          Know Your Customer (KYC)
        </Typography>
        <DemoSwitcher current={status} onChange={handleDemo} />
      </Box>

      {/* ─── STEP 1: FORM ─────────────────────────────────────────────────── */}
      {status === 'not-started' && (
        <>
          <FormBanner />
          <WhyKYCCard />

          <SectionCard title="Personal Information">
            <Field label="Full Name" error={attempted && !nameValid ? 'Full name is required' : undefined}>
              <Box
                component="input"
                type="text"
                value={fullName}
                placeholder="Enter your full name as per PAN/Aadhaar"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                sx={INPUT_SX}
              />
            </Field>
          </SectionCard>

          <SectionCard title="Document Verification" action={<SecurityBadge />}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: '20px', color: '#6D6777' }}>
              Upload clear copies of your PAN card and Aadhaar card. We only need the documents — no card numbers to type.
            </Typography>
            <UploadZone title="PAN Card" hint="Front of your PAN card showing your name and PAN." file={panDoc} onFile={setPanDoc} onRemove={() => setPanDoc(null)} error={attempted && !panDoc ? 'Please upload your PAN card' : undefined} />
            <Box sx={{ borderTop: '1px solid #E3E6EC' }} />
            <UploadZone title="Aadhaar Card" hint="Front of your Aadhaar card showing your name and photo." file={aadhaarDoc} onFile={setAadhaarDoc} onRemove={() => setAadhaarDoc(null)} error={attempted && !aadhaarDoc ? 'Please upload your Aadhaar card' : undefined} />
          </SectionCard>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <InfoOutlinedIcon sx={{ fontSize: 15, color: '#97939E', mt: '1px', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '13px', color: '#97939E', lineHeight: '18px' }}>
                By submitting, you confirm the documents belong to you and the information is accurate.
              </Typography>
            </Box>
            <Box
              role="button"
              aria-disabled={!canSubmit || submitting}
              tabIndex={0}
              onClick={handleSubmit}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              sx={{
                alignSelf: { xs: 'stretch', md: 'flex-start' },
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                px: '32px', py: '14px', borderRadius: '12px',
                backgroundColor: !canSubmit || submitting ? '#9AAA92' : '#476D59',
                cursor: !canSubmit || submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
                '&:hover': { backgroundColor: !canSubmit || submitting ? '#9AAA92' : '#3A5C49' },
              }}
            >
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                {submitting ? 'Submitting…' : 'Submit for Verification'}
              </Typography>
            </Box>
            {!canSubmit && (
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#97939E' }}>
                Please add {missing.join(', ').replace(/, ([^,]*)$/, ' and $1')} to submit.
              </Typography>
            )}
          </Box>
        </>
      )}

      {/* ─── STEP 2 & 3: STATUS DASHBOARD ─────────────────────────────────── */}
      {(status === 'pending' || status === 'verified') && (
        <>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#6D6777' }}>
            Reference <Box component="span" sx={{ fontWeight: fontWeight.semiBold, letterSpacing: '0.4px', color: '#433C50' }}>{ref}</Box>
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: '16px', alignItems: 'flex-start' }}>
            {/* Left: status + timeline */}
            <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <KycStatusCard status={status} />
              <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '16px', p: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#474743' }}>Timeline</Typography>
                <Timeline events={buildTimeline(status, submittedAt, verifiedAt)} />
              </Box>
            </Box>

            {/* Right: customer details */}
            <CustomerDetails name={fullName} address={address} reference={ref} />
          </Box>

          {/* Demo / utility actions */}
          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {status === 'pending' && (
              <Box role="button" tabIndex={0} onClick={handleApprove} onKeyDown={(e) => { if (e.key === 'Enter') handleApprove(); }}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', px: '20px', py: '12px', borderRadius: '12px', border: '1px solid #E3E6EC', backgroundColor: '#FFFFFF', cursor: 'pointer', '&:hover': { backgroundColor: '#F7F8FB' } }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#5A6454' }}>Simulate approval (demo)</Typography>
              </Box>
            )}
            <Box role="button" tabIndex={0} onClick={handleEdit} onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); }}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: '20px', py: '12px', borderRadius: '12px', border: '1px solid #E3E6EC', backgroundColor: '#FFFFFF', cursor: 'pointer', '&:hover': { backgroundColor: '#F7F8FB' } }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#5A6454' }}>Update documents</Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default KYCPage;
