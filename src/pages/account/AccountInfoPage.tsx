'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileData {
  preferredName: string;
  email: string;
  mobile: string;
  password: string;
}

// ─── Shared field styles ──────────────────────────────────────────────────────

const INPUT_SX = {
  width: '100%',
  border: '1px solid #D9D9D9',
  borderRadius: '12px',
  px: '12px',
  py: '12px',
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.regular,
  fontSize: '16px',
  lineHeight: '22.4px',
  color: '#433C50',
  outline: 'none',
  backgroundColor: '#FFFFFF',
  '&::placeholder': { color: '#97939E' },
  '&:focus': { borderColor: '#476D59' },
} as const;

const READONLY_INPUT_SX = {
  ...INPUT_SX,
  backgroundColor: '#F8F6F6',
  color: '#6D6777',
  cursor: 'not-allowed',
} as const;

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readonly?: boolean;
  type?: string;
  placeholder?: string;
  onEditClick?: () => void;
  showEditIcon?: boolean;
}

const FormField = ({ label, value, onChange, readonly = false, type = 'text', placeholder, onEditClick, showEditIcon }: FormFieldProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', maxWidth: 459 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Typography
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: '14px',
          lineHeight: '19.6px',
          color: '#433C50',
          flex: 1,
        }}
      >
        {label}
      </Typography>
      {showEditIcon && (
        <Box
          role="button"
          tabIndex={0}
          onClick={onEditClick}
          onKeyDown={(e) => { if (e.key === 'Enter') onEditClick?.(); }}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.7 } }}
        >
          <EditIcon sx={{ fontSize: 16, color: '#433C50' }} />
        </Box>
      )}
    </Box>
    <Box
      component="input"
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readonly}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
      sx={readonly ? READONLY_INPUT_SX : INPUT_SX}
    />
  </Box>
);

// ─── AccountInfoPage ──────────────────────────────────────────────────────────

export const AccountInfoPage = () => {
  const [profile, setProfile] = useState<ProfileData>({
    preferredName: '',
    email: 'kaushal@outlook.com',
    mobile: '9982663723',
    password: '**********',
  });

  const [editingField, setEditingField] = useState<keyof ProfileData | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);

  const startEdit = (field: keyof ProfileData) => {
    if (field === 'password') return; // password edit is typically a separate flow
    setEditingField(field);
    setEditValue(profile[field]);
    setSaved(false);
  };

  const saveEdit = () => {
    if (!editingField) return;
    setProfile((prev) => ({ ...prev, [editingField]: editValue }));
    setEditingField(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semiBold,
          fontSize: '22px',
          lineHeight: '28.6px',
          color: '#474743',
        }}
      >
        Account Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Preferred Name */}
        {editingField === 'preferredName' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: 459 }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>
              Preferred Name
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '8px' }}>
              <Box
                component="input"
                value={editValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                autoFocus
                sx={{ ...INPUT_SX, flex: 1 }}
              />
              <Box
                role="button"
                tabIndex={0}
                onClick={saveEdit}
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); }}
                sx={{ px: '16px', py: { xs: '12px', md: '10px' }, backgroundColor: '#476D59', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { backgroundColor: '#3A5C49' } }}
              >
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                  Save
                </Typography>
              </Box>
              <Box
                role="button"
                tabIndex={0}
                onClick={cancelEdit}
                onKeyDown={(e) => { if (e.key === 'Enter') cancelEdit(); }}
                sx={{ px: '16px', py: { xs: '12px', md: '10px' }, border: '1px solid #D9D9D9', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { backgroundColor: '#F7F8FB' } }}
              >
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50', whiteSpace: 'nowrap' }}>
                  Cancel
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <FormField
            label="Preferred Name"
            value={profile.preferredName}
            onChange={(v) => setProfile((p) => ({ ...p, preferredName: v }))}
            placeholder="Enter preferred name"
            showEditIcon={false}
          />
        )}

        {/* Email */}
        <FormField
          label="Email"
          value={profile.email}
          readonly
          showEditIcon
          onEditClick={() => startEdit('email')}
        />

        {/* Mobile */}
        <FormField
          label="Mobile Number"
          value={profile.mobile}
          readonly
          showEditIcon
          onEditClick={() => startEdit('mobile')}
        />

        {/* Password */}
        <FormField
          label="Password"
          value={profile.password}
          readonly
          type="password"
          showEditIcon
          onEditClick={() => {}}
        />
      </Box>

      {saved && (
        <Box sx={{ backgroundColor: '#E8F5E9', border: '1px solid #476D59', borderRadius: '8px', px: '16px', py: '10px', maxWidth: 459 }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#2E7D32' }}>
            Changes saved successfully.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AccountInfoPage;
