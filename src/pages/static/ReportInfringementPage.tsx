'use client';

import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { StaticPageShell, type StaticPageProps } from './StaticPageShell';

// ─── Shared form styles (consistent with KYC / Checkout / Account) ──────────────

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

const TODAY = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const DEMO_OTP = '123456';
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ─── Small building blocks ──────────────────────────────────────────────────────

const SectionCard = ({ num, title, action, children }: { num: number; title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#EEF2F0', color: '#2C4D34', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12.5px' }}>{num}</Typography>
        </Box>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#474743' }}>{title}</Typography>
      </Box>
      {action}
    </Box>
    <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '16px', p: { xs: '18px', md: '24px' }, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {children}
    </Box>
  </Box>
);

const Field = ({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#433C50' }}>
      {label}{optional && <Box component="span" sx={{ color: '#97939E', fontWeight: fontWeight.regular }}> (optional)</Box>}
    </Typography>
    {children}
    {error && <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#A6492F' }}>{error}</Typography>}
  </Box>
);

const POLICY = [
  {
    id: 'trademark', title: 'Trademark complaint', Icon: GppGoodOutlinedIcon,
    points: [
      'Report your trademark complaint in writing and identify any relevant registration / application numbers, the registration country, and the owner.',
      'Provide a description of the content on our site that you claim infringes a trademark, and information sufficient to locate the material (e.g. URLs and screenshots).',
      'Give a description of how the trademark is allegedly infringed.',
      'Provide an electronic or physical signature confirming you act on behalf of the trademark owner.',
      'Attach files relevant to your request.',
    ],
  },
  {
    id: 'copyright', title: 'Copyright complaint', Icon: DescriptionOutlinedIcon,
    points: [
      'Report your copyright complaint in writing.',
      'Include a description of the copyrighted work claimed to be infringed, and of the content on our site that you claim infringes it.',
      'Provide information sufficient to locate the material on our site (e.g. URLs and screenshots).',
      'Declare a good-faith belief that the use is not authorized, that your information is accurate, and that you are the owner or authorized to act for them.',
    ],
  },
  {
    id: 'other', title: 'Other intellectual property complaints', Icon: LinkOutlinedIcon,
    points: [
      'Report your complaint in writing and identify any relevant registration / application numbers, the registration country, and the owner.',
      'Provide complete contact information (full name, postal address, email, and phone number).',
      'Describe the content you claim infringes and provide information sufficient to locate it.',
      'Describe how the intellectual property is allegedly infringed and provide a signature confirming your authority.',
    ],
  },
];

const PolicyAccordion = () => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Box sx={{ border: '1px solid #E3E6EC', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {POLICY.map((item, i) => {
        const isOpen = open === item.id;
        const Icon = item.Icon;
        return (
          <Box key={item.id} sx={{ borderTop: i === 0 ? 'none' : '1px solid #E3E6EC' }}>
            <Box
              role="button"
              tabIndex={0}
              onClick={() => setOpen(isOpen ? null : item.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') setOpen(isOpen ? null : item.id); }}
              sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '18px', py: '15px', cursor: 'pointer', '&:hover': { backgroundColor: '#F7F8FB' } }}
            >
              <Box sx={{ width: 32, height: 32, borderRadius: '9px', backgroundColor: '#EEF2F0', color: '#2C4D34', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon sx={{ fontSize: 18 }} />
              </Box>
              <Typography sx={{ flex: 1, fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14.5px', color: '#3E3E3C' }}>{item.title}</Typography>
              <ExpandMoreIcon sx={{ fontSize: 20, color: '#6D6777', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
            </Box>
            {isOpen && (
              <Box component="ol" sx={{ m: 0, px: '18px', pb: '18px', pl: '62px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.points.map((p) => (
                  <Box component="li" key={p} sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13.5px', lineHeight: 1.65, color: '#6D6777' }}>{p}</Box>
                ))}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const COMPLAINT_TYPES = [
  { value: 'trademark',   title: 'Trademark',        sub: 'Brand name, logo, or packaging' },
  { value: 'copyright',   title: 'Copyright',         sub: 'Images, text, or design' },
  { value: 'counterfeit', title: 'Counterfeit goods', sub: 'Fake or unauthorized product' },
  { value: 'patent',      title: 'Patent',            sub: 'Product design or formulation' },
];

// ─── Page ───────────────────────────────────────────────────────────────────────

export const ReportInfringementPage = (shell: StaticPageProps) => {
  // Your details
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  // Email OTP
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Complaint
  const [ipType, setIpType] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);
  const [regNumber, setRegNumber] = useState('');
  const [description, setDescription] = useState('');

  // Evidence
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Declaration
  const [declare1, setDeclare1] = useState(false);
  const [declare2, setDeclare2] = useState(false);
  const [signature, setSignature] = useState('');

  // Submit
  const [attempted, setAttempted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = () => {
    if (!isValidEmail(email)) { setEmailError('Enter a valid email address.'); return; }
    setEmailError('');
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setOtpOpen(true);
    setResendIn(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 0);
  };

  const confirmOtp = () => {
    const code = otp.join('');
    if (code.length < 6) { setOtpError('Enter all 6 digits.'); return; }
    if (code !== DEMO_OTP) { setOtpError('Incorrect code. Please try again. (Demo code: 123456)'); return; }
    setEmailVerified(true);
    setOtpOpen(false);
  };

  const onOtpChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    setOtpError('');
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const onOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const onOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6).split('');
    if (!digits.length) return;
    const next = ['', '', '', '', '', ''];
    digits.forEach((d, idx) => { next[idx] = d; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  const changeEmail = () => { setOtpOpen(false); setEmailVerified(false); };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const updateUrl = (i: number, v: string) => setUrls((prev) => prev.map((u, idx) => (idx === i ? v : u)));
  const addUrl = () => setUrls((prev) => [...prev, '']);
  const removeUrl = (i: number) => setUrls((prev) => prev.filter((_, idx) => idx !== i));

  const nameOk = fullName.trim().length > 1;
  const typeOk = !!ipType;
  const urlOk = urls.some((u) => u.trim().length > 0);
  const descOk = description.trim().length > 10;
  const evidenceOk = files.length > 0;
  const declareOk = declare1 && declare2;
  const signOk = signature.trim().length > 1;
  const canSubmit = nameOk && emailVerified && typeOk && urlOk && descOk && evidenceOk && declareOk && signOk;

  const handleSubmit = () => {
    setAttempted(true);
    if (!canSubmit) return;
    setReference(`IPC-2026-${Math.floor(10000 + Math.random() * 89999)}`);
    setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const submitted = reference !== null;

  return (
    <StaticPageShell
      {...shell}
      eyebrow="Brand & IP Protection"
      title="Report intellectual property infringement"
      lede="If you're a brand owner or authorized representative and believe a listing on walherb.com infringes your trademark, copyright, patent, or involves counterfeit goods, use this form to file a complaint with our trust & safety team."
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Info note */}
        <Box sx={{ display: 'flex', gap: '12px', backgroundColor: '#F6EFDD', border: '1px solid #E9DCB6', borderRadius: '12px', p: '16px 18px' }}>
          <InfoOutlinedIcon sx={{ fontSize: 20, color: '#B68A35', flexShrink: 0, mt: '1px' }} />
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13.5px', lineHeight: 1.6, color: '#5C4A1E' }}>
            This form is for IP rights holders only. If you have a general product or order issue, please contact Customer Support instead. Submitting a false or bad-faith complaint may result in legal liability.
          </Typography>
        </Box>

        {/* Policy intro + accordion */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13.5px', lineHeight: 1.7, color: '#6D6777' }}>
            Walherb strives to ensure listed items do not infringe the intellectual property of third parties. If you wish to make a complaint regarding alleged infringement, please review the relevant guidance below so we can investigate, assess, and respond.
          </Typography>
          <PolicyAccordion />
        </Box>

        {/* 1. Your details */}
        <SectionCard num={1} title="Your details">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '16px' }}>
            <Field label="Full name" error={attempted && !nameOk ? 'Enter your full name.' : undefined}>
              <Box component="input" type="text" value={fullName} placeholder="e.g. Ananya Rao" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} sx={INPUT_SX} />
            </Field>
            <Field label="Company / brand owner" optional>
              <Box component="input" type="text" value={company} placeholder="e.g. Rao Botanicals Pvt. Ltd." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)} sx={INPUT_SX} />
            </Field>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '16px' }}>
            <Field label="Email address" error={emailError || (attempted && !emailVerified ? 'Please verify your email.' : undefined)}>
              <Box sx={{ display: 'flex', gap: '8px' }}>
                <Box component="input" type="email" value={email} disabled={emailVerified} placeholder="you@company.com"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); if (emailVerified) setEmailVerified(false); }}
                  sx={{ ...INPUT_SX, flex: 1 }} />
                <Box
                  role="button" tabIndex={emailVerified ? -1 : 0}
                  onClick={emailVerified ? undefined : sendOtp}
                  onKeyDown={(e) => { if (!emailVerified && e.key === 'Enter') sendOtp(); }}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: '5px', px: '14px', borderRadius: '12px', flexShrink: 0,
                    border: `1px solid ${emailVerified ? '#9AC0A6' : '#2C4D34'}`,
                    backgroundColor: emailVerified ? '#EEF2F0' : '#FFFFFF',
                    color: emailVerified ? '#2C4D34' : '#2C4D34',
                    cursor: emailVerified ? 'default' : 'pointer',
                    '&:hover': { backgroundColor: emailVerified ? '#EEF2F0' : '#EEF2F0' },
                  }}
                >
                  {emailVerified && <CheckIcon sx={{ fontSize: 15 }} />}
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {emailVerified ? 'Verified' : 'Verify'}
                  </Typography>
                </Box>
              </Box>
            </Field>
            <Field label="Phone number" optional>
              <Box component="input" type="tel" value={phone} placeholder="+91 98765 43210" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} sx={INPUT_SX} />
            </Field>
          </Box>

          {/* OTP panel */}
          {otpOpen && (
            <Box sx={{ backgroundColor: '#F7F8FB', border: '1px solid #E3E6EC', borderRadius: '12px', p: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#6D6777' }}>
                We&apos;ve sent a 6-digit code to <Box component="span" sx={{ color: '#433C50', fontWeight: fontWeight.medium }}>{email}</Box>.{' '}
                <Box component="span" role="button" tabIndex={0} onClick={changeEmail} onKeyDown={(e) => { if (e.key === 'Enter') changeEmail(); }} sx={{ color: '#2C4D34', fontWeight: fontWeight.medium, textDecoration: 'underline', cursor: 'pointer' }}>Change email</Box>
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px' }}>
                {otp.map((d, i) => (
                  <Box
                    key={i}
                    component="input"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    ref={(el: HTMLInputElement | null) => { otpRefs.current[i] = el; }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => onOtpKey(i, e)}
                    onPaste={onOtpPaste}
                    sx={{
                      width: 42, height: 48, textAlign: 'center', fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px',
                      color: '#1F322A', backgroundColor: '#FFFFFF', borderRadius: '9px', outline: 'none',
                      border: `1px solid ${d ? '#476D59' : '#E3E6EC'}`, '&:focus': { borderColor: '#476D59' },
                    }}
                  />
                ))}
              </Box>
              {otpError && <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#A6492F' }}>{otpError}</Typography>}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <Box role="button" tabIndex={0} onClick={confirmOtp} onKeyDown={(e) => { if (e.key === 'Enter') confirmOtp(); }}
                  sx={{ px: '16px', py: '9px', borderRadius: '9px', backgroundColor: '#2C4D34', cursor: 'pointer', '&:hover': { backgroundColor: '#23391f' } }}>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13.5px', color: '#FFFFFF' }}>Confirm code</Typography>
                </Box>
                {resendIn > 0 ? (
                  <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12.5px', color: '#6D6777' }}>
                    Resend code in <Box component="span" sx={{ fontWeight: fontWeight.semiBold, color: '#433C50' }}>{resendIn}s</Box>
                  </Typography>
                ) : (
                  <Box component="span" role="button" tabIndex={0} onClick={sendOtp} onKeyDown={(e) => { if (e.key === 'Enter') sendOtp(); }} sx={{ fontFamily: fontFamily.sans, fontSize: '13px', fontWeight: fontWeight.medium, color: '#2C4D34', textDecoration: 'underline', cursor: 'pointer' }}>Resend code</Box>
                )}
              </Box>
            </Box>
          )}

          <Field label="Your relationship to the IP">
            <Box component="select" value={relationship} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRelationship(e.target.value)} sx={{ ...INPUT_SX, cursor: 'pointer' }}>
              <option value="">Select one</option>
              <option>I am the rights owner</option>
              <option>I am an authorized legal representative</option>
              <option>I am an agency acting on the owner&apos;s behalf</option>
            </Box>
          </Field>
        </SectionCard>

        {/* 2. Type of complaint */}
        <SectionCard num={2} title="Type of complaint">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '10px' }}>
            {COMPLAINT_TYPES.map((t) => {
              const selected = ipType === t.value;
              return (
                <Box
                  key={t.value}
                  role="button" tabIndex={0}
                  onClick={() => setIpType(t.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setIpType(t.value); }}
                  sx={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', p: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: `1px solid ${selected ? '#476D59' : '#E3E6EC'}`,
                    backgroundColor: selected ? '#EEF2F0' : '#FFFFFF',
                    '&:hover': { borderColor: '#476D59' },
                  }}
                >
                  <Box sx={{ width: 18, height: 18, borderRadius: '50%', mt: '1px', flexShrink: 0, border: `1.5px solid ${selected ? '#476D59' : '#C5C5C5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selected && <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#476D59' }} />}
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13.5px', color: '#433C50' }}>{t.title}</Typography>
                    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '11.5px', color: '#7F7F79', mt: '2px' }}>{t.sub}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
          {attempted && !typeOk && <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#A6492F' }}>Please select a complaint type.</Typography>}
        </SectionCard>

        {/* 3. Infringing listings */}
        <SectionCard num={3} title="Infringing listing(s)">
          <Field label="Walherb.com product or listing URLs" error={attempted && !urlOk ? 'Add at least one listing URL.' : undefined}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {urls.map((u, i) => (
                <Box key={i} sx={{ display: 'flex', gap: '8px' }}>
                  <Box component="input" type="url" value={u} placeholder="https://walherb.com/products/..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateUrl(i, e.target.value)} sx={{ ...INPUT_SX, flex: 1 }} />
                  <Box
                    role="button" aria-label="Remove URL" tabIndex={urls.length === 1 ? -1 : 0}
                    onClick={urls.length === 1 ? undefined : () => removeUrl(i)}
                    onKeyDown={(e) => { if (urls.length > 1 && e.key === 'Enter') removeUrl(i); }}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, borderRadius: '12px', border: '1px solid #E3E6EC', backgroundColor: '#F7F8FB', flexShrink: 0, cursor: urls.length === 1 ? 'not-allowed' : 'pointer', opacity: urls.length === 1 ? 0.5 : 1, '&:hover': { backgroundColor: urls.length === 1 ? '#F7F8FB' : '#EEF0F2' } }}
                  >
                    <CloseIcon sx={{ fontSize: 16, color: '#6D6777' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Field>
          <Box role="button" tabIndex={0} onClick={addUrl} onKeyDown={(e) => { if (e.key === 'Enter') addUrl(); }} sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
            <AddIcon sx={{ fontSize: 16, color: '#2C4D34' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', color: '#2C4D34' }}>Add another listing</Typography>
          </Box>

          <Field label="Registered trademark / copyright number" optional>
            <Box component="input" type="text" value={regNumber} placeholder="e.g. TM-4471829 or registration number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegNumber(e.target.value)} sx={INPUT_SX} />
          </Field>

          <Field label="Describe the infringement" error={attempted && !descOk ? 'Please add a short description (10+ characters).' : undefined}>
            <Box component="textarea" value={description} placeholder="Explain how this listing infringes your IP rights, including how it differs from your authentic product or branding." onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} sx={{ ...INPUT_SX, minHeight: 110, resize: 'vertical' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#97939E' }}>Be as specific as possible — this helps our team review and act faster.</Typography>
          </Field>
        </SectionCard>

        {/* 4. Supporting evidence */}
        <SectionCard num={4} title="Supporting evidence">
          <Field label="Proof of ownership & evidence" error={attempted && !evidenceOk ? 'Please upload at least one file.' : undefined}>
            <Box
              role="button" tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click(); } }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              sx={{
                border: `1.5px dashed ${dragging ? '#3A5C49' : '#A9C5B2'}`, borderRadius: '12px', px: '20px', py: '24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer',
                backgroundColor: dragging ? '#F0F7F4' : '#FAFAF9', transition: 'border-color 0.15s, background-color 0.15s',
                '&:hover': { borderColor: '#476D59', backgroundColor: '#F0F7F4' },
              }}
            >
              <FileUploadOutlinedIcon sx={{ fontSize: 24, color: '#6D6777' }} />
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#476D59' }}>Click to upload or drag and drop</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '11.5px', color: '#97939E', textAlign: 'center' }}>Trademark certificates, screenshots, product photos — PDF, PNG or JPG, up to 10 MB each</Typography>
            </Box>
            <Box component="input" ref={fileRef} type="file" accept="image/*,.pdf" multiple sx={{ display: 'none' }} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { addFiles(e.target.files); e.target.value = ''; }} />
            {files.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '4px' }}>
                {files.map((f, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #9AC0A6', backgroundColor: '#EEF2F0', borderRadius: '9px', px: '12px', py: '8px' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 16, color: '#2C4D34' }} />
                    <Typography sx={{ flex: 1, minWidth: 0, fontFamily: fontFamily.sans, fontSize: '12.5px', color: '#2C4D34', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</Typography>
                    <Box role="button" aria-label="Remove file" tabIndex={0} onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} onKeyDown={(e) => { if (e.key === 'Enter') setFiles((prev) => prev.filter((_, idx) => idx !== i)); }} sx={{ display: 'flex', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
                      <CloseIcon sx={{ fontSize: 15, color: '#2C4D34' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Field>
        </SectionCard>

        {/* 5. Declaration */}
        <SectionCard num={5} title="Declaration">
          <Box sx={{ backgroundColor: '#EEF2F0', border: '1px solid #CFE0CD', borderRadius: '12px', p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', lineHeight: 1.6, color: '#33503A' }}>
              I have a good faith belief that the use of the intellectual property described above is not authorized by the rights owner, their agent, or the law.
            </Typography>
            {[
              { checked: declare1, set: setDeclare1, label: 'I declare that the information in this complaint is accurate and complete to the best of my knowledge.' },
              { checked: declare2, set: setDeclare2, label: 'I am authorized to act on behalf of the rights owner, and understand that false complaints may result in legal consequences.' },
            ].map((row, i) => (
              <Box key={i} role="button" tabIndex={0} onClick={() => row.set(!row.checked)} onKeyDown={(e) => { if (e.key === 'Enter') row.set(!row.checked); }} sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '5px', mt: '1px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${row.checked ? '#2C4D34' : '#A9B3A6'}`, backgroundColor: row.checked ? '#2C4D34' : '#FFFFFF' }}>
                  {row.checked && <CheckIcon sx={{ fontSize: 13, color: '#FFFFFF' }} />}
                </Box>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', lineHeight: 1.5, color: '#33503A' }}>{row.label}</Typography>
              </Box>
            ))}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '14px', mt: '2px' }}>
              <Field label="Digital signature (type full name)" error={attempted && !signOk ? 'Please sign with your full name.' : undefined}>
                <Box component="input" type="text" value={signature} placeholder={fullName || 'Ananya Rao'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignature(e.target.value)} sx={INPUT_SX} />
              </Field>
              <Field label="Date">
                <Box component="input" type="text" value={TODAY} readOnly sx={{ ...INPUT_SX, backgroundColor: '#F7F8FB', color: '#6D6777' }} />
              </Field>
            </Box>
          </Box>
        </SectionCard>

        {/* Submit */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Box
            role="button" aria-disabled={!canSubmit || submitted} tabIndex={0}
            onClick={submitted ? undefined : handleSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter' && !submitted) handleSubmit(); }}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '7px', px: '22px', py: '13px', borderRadius: '10px',
              backgroundColor: submitted ? '#476D59' : !canSubmit ? '#9AAA92' : '#2C4D34',
              cursor: !canSubmit || submitted ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
              '&:hover': { backgroundColor: !canSubmit || submitted ? undefined : '#23391f' },
            }}
          >
            {submitted ? <CheckIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /> : <SendOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />}
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14.5px', color: '#FFFFFF' }}>
              {submitted ? 'Submitted' : 'Submit complaint'}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#6D6777' }}>Our team typically responds within 3–5 business days.</Typography>
        </Box>

        {/* Success */}
        {submitted && (
          <Box ref={successRef} sx={{ display: 'flex', alignItems: 'flex-start', gap: '14px', backgroundColor: '#EEF2F0', border: '1px solid #CFE0CD', borderRadius: '16px', p: '24px' }}>
            <Box sx={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#2C4D34', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '17px', color: '#2C4D34', mb: '4px' }}>Complaint submitted</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13.5px', lineHeight: 1.6, color: '#33503A' }}>
                Reference <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: fontWeight.semiBold }}>{reference}</Box>. We&apos;ve sent a confirmation to your email and will follow up once our trust &amp; safety team has reviewed your submission.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </StaticPageShell>
  );
};

export default ReportInfringementPage;
