'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentView = 'list' | 'add-form' | 'success';

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

interface CardFormData {
  number: string;
  name: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  zip: string;
  saveCard: boolean;
}

// ─── Mock saved cards ──────────────────────────────────────────────────────────

const INITIAL_CARDS: SavedCard[] = [];

// ─── Shared input style ───────────────────────────────────────────────────────

const INPUT_SX = {
  width: '100%',
  border: '1px solid #D9D9D9',
  borderRadius: '12px',
  px: '12px',
  py: '12px',
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.regular,
  fontSize: '14px',
  color: '#433C50',
  outline: 'none',
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box' as const,
  '&::placeholder': { color: '#97939E' },
  '&:focus': { borderColor: '#476D59' },
} as const;

// ─── Card illustration ────────────────────────────────────────────────────────

const CardIllustration = () => (
  <Box sx={{ position: 'relative', width: 240, height: 148, flexShrink: 0 }}>
    {/* Back card */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 24,
        width: 200,
        height: 124,
        backgroundColor: '#476D59',
        borderRadius: '12px',
        opacity: 0.5,
      }}
    />
    {/* Front card */}
    <Box
      sx={{
        position: 'absolute',
        top: 24,
        left: 0,
        width: 200,
        height: 124,
        background: 'linear-gradient(135deg, #1F322A 0%, #476D59 100%)',
        borderRadius: '12px',
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CreditCardIcon sx={{ fontSize: 28, color: 'rgba(255,255,255,0.8)' }} />
      <Box>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
          •••• •••• •••• 0000
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>CARD HOLDER</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>EXPIRES</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '11px', color: '#FFFFFF' }}>Your Name</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '11px', color: '#FFFFFF' }}>MM/YY</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', py: '80px' }}>
    <CreditCardIcon sx={{ fontSize: 72, color: '#E3E6EC' }} />
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#433C50' }}>
        No payment methods yet
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '14px', color: '#97939E' }}>
        Add a credit or debit card to make checkout faster
      </Typography>
    </Box>
    <Box
      role="button"
      tabIndex={0}
      onClick={onAdd}
      onKeyDown={(e) => { if (e.key === 'Enter') onAdd(); }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        px: '32px',
        py: '12px',
        backgroundColor: '#1F322A',
        borderRadius: '10px',
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#162319' },
      }}
    >
      <AddIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#FFFFFF' }}>
        Add Payment Method
      </Typography>
    </Box>
  </Box>
);

// ─── Saved card chip ──────────────────────────────────────────────────────────

const SavedCardRow = ({
  card,
  onDelete,
  onSetDefault,
}: {
  card: SavedCard;
  onDelete: () => void;
  onSetDefault: () => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      px: '20px',
      py: '16px',
      backgroundColor: '#F7F8FB',
      border: '1px solid #E3E6EC',
      borderRadius: '14px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Box
        sx={{
          width: 48,
          height: 32,
          background: 'linear-gradient(135deg, #1F322A 0%, #476D59 100%)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CreditCardIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
      </Box>
      <Box>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#433C50' }}>
          {card.brand} •••• {card.last4}
        </Typography>
        <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#97939E' }}>
          Expires {card.expiryMonth}/{card.expiryYear}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {card.isDefault ? (
        <Box sx={{ backgroundColor: '#476D59', borderRadius: '500px', px: '12px', py: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '11px', color: '#FFFFFF' }}>Default</Typography>
        </Box>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          onClick={onSetDefault}
          onKeyDown={(e) => { if (e.key === 'Enter') onSetDefault(); }}
          sx={{ border: '1px solid #E3E6EC', borderRadius: '500px', px: '12px', py: '4px', cursor: 'pointer', '&:hover': { backgroundColor: '#EAEEF0' } }}
        >
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '11px', color: '#433C50' }}>Set default</Typography>
        </Box>
      )}
      <Box
        role="button"
        tabIndex={0}
        onClick={onDelete}
        onKeyDown={(e) => { if (e.key === 'Enter') onDelete(); }}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', p: '4px', borderRadius: '4px', '&:hover': { backgroundColor: '#FFEBEE' } }}
      >
        <DeleteOutlineIcon sx={{ fontSize: 18, color: '#FF4C51' }} />
      </Box>
    </Box>
  </Box>
);

// ─── Add Card Form ────────────────────────────────────────────────────────────

const EMPTY_FORM: CardFormData = { number: '', name: '', expiryMonth: '', expiryYear: '', cvv: '', zip: '', saveCard: false };

const AddCardForm = ({ onBack, onSave }: { onBack: () => void; onSave: (data: CardFormData) => void }) => {
  const [form, setForm] = useState<CardFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CardFormData, string>>>({});

  const set = (field: keyof CardFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = () => {
    const errs: Partial<Record<keyof CardFormData, string>> = {};
    if (!form.number.trim() || form.number.replace(/\D/g, '').length < 16)
      errs.number = 'Enter a valid 16-digit card number';
    if (!form.name.trim()) errs.name = 'Cardholder name is required';
    if (!form.expiryMonth.trim()) errs.expiryMonth = 'Required';
    if (!form.expiryYear.trim())  errs.expiryYear  = 'Required';
    if (!form.cvv.trim() || form.cvv.length < 3) errs.cvv = 'Enter valid CVV';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <Box sx={{ display: 'flex', gap: { xs: '24px', md: '40px' }, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Left: card illustration */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', pt: '16px' }}>
        <CardIllustration />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LockIcon sx={{ fontSize: 14, color: '#476D59' }} />
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '12px', color: '#476D59' }}>
            Secured with 256-bit encryption
          </Typography>
        </Box>
      </Box>

      {/* Right: form */}
      <Box sx={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Card number */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>Card Number</Typography>
          <Box
            component="input"
            value={form.number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, number: formatCardNumber(e.target.value) }))}
            placeholder="0000 0000 0000 0000"
            sx={INPUT_SX}
          />
          {errors.number && <Typography sx={{ fontSize: '12px', color: '#FF4C51' }}>{errors.number}</Typography>}
        </Box>

        {/* Cardholder name */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>Cardholder Name</Typography>
          <Box component="input" value={form.name} onChange={set('name')} placeholder="Name on card" sx={INPUT_SX} />
          {errors.name && <Typography sx={{ fontSize: '12px', color: '#FF4C51' }}>{errors.name}</Typography>}
        </Box>

        {/* Expiry + CVV + ZIP */}
        <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: '12px' }}>
          <Box sx={{ flex: { xs: '1 1 40%', md: 1 }, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>MM</Typography>
            <Box component="input" value={form.expiryMonth} onChange={set('expiryMonth')} placeholder="MM" maxLength={2} sx={INPUT_SX} />
            {errors.expiryMonth && <Typography sx={{ fontSize: '12px', color: '#FF4C51' }}>{errors.expiryMonth}</Typography>}
          </Box>
          <Box sx={{ flex: { xs: '1 1 40%', md: 1 }, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>YY</Typography>
            <Box component="input" value={form.expiryYear} onChange={set('expiryYear')} placeholder="YY" maxLength={2} sx={INPUT_SX} />
            {errors.expiryYear && <Typography sx={{ fontSize: '12px', color: '#FF4C51' }}>{errors.expiryYear}</Typography>}
          </Box>
          <Box sx={{ flex: { xs: '1 1 40%', md: 1 }, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>CVV</Typography>
            <Box component="input" value={form.cvv} onChange={set('cvv')} placeholder="•••" maxLength={4} type="password" sx={INPUT_SX} />
            {errors.cvv && <Typography sx={{ fontSize: '12px', color: '#FF4C51' }}>{errors.cvv}</Typography>}
          </Box>
          <Box sx={{ flex: { xs: '1 1 40%', md: 1 }, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>ZIP</Typography>
            <Box component="input" value={form.zip} onChange={set('zip')} placeholder="ZIP" maxLength={6} sx={INPUT_SX} />
          </Box>
        </Box>

        {/* Save card checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            size="small"
            checked={form.saveCard}
            onChange={(e) => setForm((p) => ({ ...p, saveCard: e.target.checked }))}
            sx={{ p: 0, color: '#D9D9D9', '&.Mui-checked': { color: '#476D59' } }}
          />
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '13px', color: '#433C50' }}>
            Save this card for future purchases
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: '12px', mt: '8px' }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={onBack}
            onKeyDown={(e) => { if (e.key === 'Enter') onBack(); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              px: '24px',
              py: '10px',
              border: '1px solid #E3E6EC',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#F7F8FB' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16, color: '#433C50' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>Back</Typography>
          </Box>
          <Box
            role="button"
            tabIndex={0}
            onClick={handleSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              px: '24px',
              py: '10px',
              backgroundColor: '#1F322A',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#162319' },
            }}
          >
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#FFFFFF' }}>
              Save Card
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Success state ────────────────────────────────────────────────────────────

const SuccessState = ({ onDone }: { onDone: () => void }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', py: '80px' }}>
    <CheckCircleIcon sx={{ fontSize: 72, color: '#476D59' }} />
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#433C50' }}>
        Card added successfully!
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '14px', color: '#97939E' }}>
        Your payment method has been saved.
      </Typography>
    </Box>
    <Box
      role="button"
      tabIndex={0}
      onClick={onDone}
      onKeyDown={(e) => { if (e.key === 'Enter') onDone(); }}
      sx={{
        px: '32px',
        py: '12px',
        backgroundColor: '#476D59',
        borderRadius: '10px',
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#3A5C49' },
      }}
    >
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#FFFFFF' }}>
        View Payment Methods
      </Typography>
    </Box>
  </Box>
);

// ─── PaymentMethodsPage ───────────────────────────────────────────────────────

export const PaymentMethodsPage = () => {
  const [view, setView] = useState<PaymentView>('list');
  const [cards, setCards] = useState<SavedCard[]>(INITIAL_CARDS);

  const addCard = (data: CardFormData) => {
    const last4 = data.number.replace(/\D/g, '').slice(-4);
    setCards((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        last4,
        brand: 'Visa',
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        holderName: data.name,
        isDefault: prev.length === 0,
      },
    ]);
    setView('success');
  };

  const deleteCard = (id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length > 0 && !next.some((c) => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  };

  const setDefault = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '22px',
            lineHeight: '28.6px',
            color: '#474743',
          }}
        >
          Payment Methods
        </Typography>
        {view === 'list' && cards.length > 0 && (
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setView('add-form')}
            onKeyDown={(e) => { if (e.key === 'Enter') setView('add-form'); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              px: '20px',
              py: '8px',
              backgroundColor: '#1F322A',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#162319' },
            }}
          >
            <AddIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#FFFFFF' }}>
              Add Card
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content by view */}
      {view === 'list' && cards.length === 0 && (
        <EmptyState onAdd={() => setView('add-form')} />
      )}

      {view === 'list' && cards.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cards.map((card) => (
            <SavedCardRow
              key={card.id}
              card={card}
              onDelete={() => deleteCard(card.id)}
              onSetDefault={() => setDefault(card.id)}
            />
          ))}
        </Box>
      )}

      {view === 'add-form' && (
        <AddCardForm
          onBack={() => setView('list')}
          onSave={addCard}
        />
      )}

      {view === 'success' && (
        <SuccessState onDone={() => setView('list')} />
      )}
    </Box>
  );
};

export default PaymentMethodsPage;
