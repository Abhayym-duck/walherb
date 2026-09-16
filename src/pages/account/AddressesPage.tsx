'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Address {
  id: string;
  name: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Rangpuri Warehouse',
    street: 'KH.No. 419-420, Rangpuri Near Security Barrier Western Green',
    street2: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110037',
    phone: '9961772812',
    isDefault: true,
  },
];

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
  '&:focus': { borderColor: '#476D59', borderWidth: '1.5px' },
} as const;

const LABEL_SX = {
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.medium,
  fontSize: '14px',
  color: '#433C50',
  mb: '4px',
} as const;

// ─── AddressForm modal ────────────────────────────────────────────────────────

interface AddressFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (addr: Omit<Address, 'id'>) => void;
  initial?: Address | null;
}

const EMPTY_FORM = {
  name: '',
  street: '',
  street2: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  isDefault: false,
};

const AddressForm = ({ open, onClose, onSave, initial }: AddressFormProps) => {
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name,
          street: initial.street,
          street2: initial.street2,
          city: initial.city,
          state: initial.state,
          pincode: initial.pincode,
          phone: initial.phone,
          isDefault: initial.isDefault,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  const set = (field: keyof Omit<typeof form, 'isDefault'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<Record<keyof typeof EMPTY_FORM, string>> = {};
    if (!form.name.trim())    errs.name    = 'Address name is required';
    if (!form.street.trim())  errs.street  = 'Address line 1 is required';
    if (!form.city.trim())    errs.city    = 'City is required';
    if (!form.state.trim())   errs.state   = 'State is required';
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
    if (!form.phone.trim())   errs.phone   = 'Mobile number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.4)' } } }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '100%', sm: 560 },
          maxWidth: '95vw',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          outline: 'none',
          p: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#433C50' }}>
          {initial ? 'Edit Address' : 'Add New Address'}
        </Typography>

        {/* Address Name */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={LABEL_SX}>Address Name</Typography>
          <Box
            component="input"
            value={form.name}
            onChange={set('name')}
            placeholder="Enter address name (e.g. Home, Office, Warehouse)"
            sx={INPUT_SX}
          />
          {errors.name && <Typography sx={{ fontSize: '12px', color: '#FF4C51', mt: '4px' }}>{errors.name}</Typography>}
        </Box>

        {/* Address Line 1 */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={LABEL_SX}>Address Line 1</Typography>
          <Box component="input" value={form.street} onChange={set('street')} placeholder="Enter address line 1" sx={INPUT_SX} />
          {errors.street && <Typography sx={{ fontSize: '12px', color: '#FF4C51', mt: '4px' }}>{errors.street}</Typography>}
        </Box>

        {/* Address Line 2 */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={LABEL_SX}>Address Line 2 <Typography component="span" sx={{ fontWeight: fontWeight.regular, fontSize: '12px', color: '#97939E' }}>(Optional)</Typography></Typography>
          <Box component="input" value={form.street2} onChange={set('street2')} placeholder="Enter address line 2" sx={INPUT_SX} />
        </Box>

        {/* State */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={LABEL_SX}>State</Typography>
          <Box
            component="select"
            value={form.state}
            onChange={set('state')}
            sx={{
              ...INPUT_SX,
              appearance: 'auto',
              cursor: 'pointer',
            }}
          >
            <option value="">Select State</option>
            {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Box>
          {errors.state && <Typography sx={{ fontSize: '12px', color: '#FF4C51', mt: '4px' }}>{errors.state}</Typography>}
        </Box>

        {/* City + Pincode */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '12px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography sx={LABEL_SX}>City</Typography>
            <Box component="input" value={form.city} onChange={set('city')} placeholder="Enter city" sx={INPUT_SX} />
            {errors.city && <Typography sx={{ fontSize: '12px', color: '#FF4C51', mt: '4px' }}>{errors.city}</Typography>}
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography sx={LABEL_SX}>Pincode</Typography>
            <Box component="input" value={form.pincode} onChange={set('pincode')} placeholder="Enter pincode" sx={INPUT_SX} />
            {errors.pincode && <Typography sx={{ fontSize: '12px', color: '#FF4C51', mt: '4px' }}>{errors.pincode}</Typography>}
          </Box>
        </Box>

        {/* Mobile Number */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={LABEL_SX}>Mobile Number</Typography>
          <Box component="input" value={form.phone} onChange={set('phone')} placeholder="Enter mobile number" sx={INPUT_SX} />
          {errors.phone && <Typography sx={{ fontSize: '12px', color: '#FF4C51', mt: '4px' }}>{errors.phone}</Typography>}
        </Box>

        {/* Default Delivery Address checkbox */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setForm((p) => ({ ...p, isDefault: !p.isDefault }))}
        >
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: '4px',
              border: `2px solid ${form.isDefault ? '#1F322A' : '#D9D9D9'}`,
              backgroundColor: form.isDefault ? '#1F322A' : '#FFFFFF',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {form.isDefault && (
              <Box component="span" sx={{ color: '#FFFFFF', fontSize: '11px', lineHeight: 1, fontWeight: 700 }}>✓</Box>
            )}
          </Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#433C50' }}>
            Set as Default Delivery Address
          </Typography>
        </Box>

        {/* Save button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '4px' }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={handleSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            sx={{
              px: '32px',
              py: '12px',
              backgroundColor: '#1F322A',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#162319' },
            }}
          >
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#FFFFFF' }}>
              Save
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// ─── AddressCard ──────────────────────────────────────────────────────────────

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: '#F7F8FB',
        border: '1px solid #E3E6EC',
        borderRadius: '14px',
        p: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: { xs: '100%', md: 'auto' },
        minWidth: { xs: 0, md: 280 },
        maxWidth: { xs: '100%', md: 340 },
        position: 'relative',
      }}
    >
      {/* Status + more options */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {address.isDefault ? (
          <Box sx={{ backgroundColor: '#476D59', borderRadius: '500px', px: '16px', py: '8px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#FFFFFF' }}>Default</Typography>
          </Box>
        ) : (
          <Box
            role="button"
            tabIndex={0}
            onClick={onSetDefault}
            onKeyDown={(e) => { if (e.key === 'Enter') onSetDefault(); }}
            sx={{ border: '1px solid #E3E6EC', borderRadius: '500px', px: '16px', py: '8px', cursor: 'pointer', '&:hover': { backgroundColor: '#E8EFF0' } }}
          >
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#433C50' }}>Set as default</Typography>
          </Box>
        )}
        <Box sx={{ position: 'relative' }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setMenuOpen((o) => !o)}
            onKeyDown={(e) => { if (e.key === 'Enter') setMenuOpen((o) => !o); }}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', p: '4px', borderRadius: '4px', '&:hover': { backgroundColor: '#E3E6EC' } }}
          >
            <MoreHorizIcon sx={{ fontSize: 16, color: '#433C50' }} />
          </Box>
          {menuOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E3E6EC',
                borderRadius: '8px',
                zIndex: 10,
                minWidth: 120,
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Edit',   action: () => { onEdit(); setMenuOpen(false); } },
                { label: 'Delete', action: () => { onDelete(); setMenuOpen(false); }, danger: true },
              ].map((item) => (
                <Box
                  key={item.label}
                  role="button"
                  tabIndex={0}
                  onClick={item.action}
                  onKeyDown={(e) => { if (e.key === 'Enter') item.action(); }}
                  sx={{ px: '16px', py: '10px', cursor: 'pointer', '&:hover': { backgroundColor: '#F7F8FB' } }}
                >
                  <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '13px', color: (item as { danger?: boolean }).danger ? '#FF4C51' : '#433C50' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Address details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Address Name — label stacked above value */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>Name:</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>
            {address.name}
          </Typography>
        </Box>
        {/* Street — label stacked above value */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>Address:</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>
            {address.street}{address.street2 ? `, ${address.street2}` : ''}
          </Typography>
        </Box>
        {/* City / State / Pincode — inline pairs, space-between */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>City:</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>{address.city}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>State:</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>{address.state}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>Pincode:</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>{address.pincode}</Typography>
          </Box>
        </Box>
        {/* Mobile — inline label + value, no background */}
        <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#433C50', lineHeight: '16.8px', whiteSpace: 'nowrap' }}>Mobile no.:</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#433C50', lineHeight: '16.8px' }}>{address.phone}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ─── AddressesPage ────────────────────────────────────────────────────────────

export const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);

  const addAddress = (data: Omit<Address, 'id'>) => {
    setAddresses((prev) => {
      const newAddr = { ...data, id: String(Date.now()) };
      if (data.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
      }
      if (prev.length === 0) newAddr.isDefault = true;
      return [...prev, newAddr];
    });
  };

  const editAddress = (id: string, data: Omit<Address, 'id'>) => {
    setAddresses((prev) => {
      if (data.isDefault) {
        return prev.map((a) => (a.id === id ? { ...a, ...data } : { ...a, isDefault: false }));
      }
      return prev.map((a) => (a.id === id ? { ...a, ...data } : a));
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length > 0 && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
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
        Address Book
      </Typography>

      {/* Cards grid */}
      <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onEdit={() => { setEditTarget(addr); setFormOpen(true); }}
            onDelete={() => deleteAddress(addr.id)}
            onSetDefault={() => setDefault(addr.id)}
          />
        ))}

        {/* Add new address card */}
        <Box
          role="button"
          tabIndex={0}
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { setEditTarget(null); setFormOpen(true); } }}
          sx={{
            backgroundColor: '#F7F8FB',
            border: '1px solid #E3E6EC',
            borderRadius: '14px',
            p: '16px',
            width: { xs: '100%', md: 'auto' },
            minWidth: { xs: 0, md: 280 },
            maxWidth: { xs: '100%', md: 340 },
            minHeight: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#EEF2F0' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #E3E6EC', borderRadius: '12px', px: '32px', py: '12px', backgroundColor: '#FFFFFF' }}>
            <AddIcon sx={{ fontSize: 16, color: '#433C50' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '16px', color: '#433C50' }}>
              Add new address
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form modal */}
      <AddressForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={(data) => {
          if (editTarget) {
            editAddress(editTarget.id, data);
          } else {
            addAddress(data);
          }
        }}
        initial={editTarget}
      />
    </Box>
  );
};

export default AddressesPage;
