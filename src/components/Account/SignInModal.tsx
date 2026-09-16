'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { useAuth } from '../../context/AuthContext';

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

const titleCase = (s: string) =>
  s.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();

export const SignInModal = () => {
  const { signInOpen, closeSignIn, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailValid = /\S+@\S+\.\S+/.test(email.trim());
  const canSubmit = emailValid && password.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const name = titleCase(email.split('@')[0]) || 'Walherb Customer';
    signIn({ name, email: email.trim() });
    setPassword('');
  };

  return (
    <Dialog
      open={signInOpen}
      onClose={closeSignIn}
      PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400, width: '100%', m: 2 } }}
    >
      <Box sx={{ p: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Brand + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Typography sx={{ fontFamily: "var(--font-pacifico, 'Pacifico', cursive)", fontWeight: 400, fontSize: 32, color: '#1F322A', lineHeight: 'normal', userSelect: 'none' }}>
            Walherb
          </Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', lineHeight: '23.4px', color: '#474743' }}>
            Sign in to your account
          </Typography>
        </Box>

        {/* Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>Email</Typography>
            <Box
              component="input"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); }}
              sx={INPUT_SX}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>Password</Typography>
            <Box
              component="input"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); }}
              sx={INPUT_SX}
            />
          </Box>
        </Box>

        {/* Sign in */}
        <Box
          role="button"
          tabIndex={0}
          onClick={handleSubmit}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            py: '13px', borderRadius: '12px',
            backgroundColor: canSubmit ? '#476D59' : '#9AAA92',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s',
            '&:hover': { backgroundColor: canSubmit ? '#3A5C49' : '#9AAA92' },
          }}
        >
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: '#FFFFFF' }}>
            Sign in
          </Typography>
        </Box>

        {/* Footer */}
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#6D6777', textAlign: 'center' }}>
          New to Walherb?{' '}
          <Box component="span" sx={{ color: '#476D59', fontWeight: fontWeight.semiBold, textDecoration: 'underline', cursor: 'pointer' }}>Create an account</Box>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default SignInModal;
