'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import type { AccountSection } from './AccountSidebar';
import { useAuth } from '../../context/AuthContext';

// ─── Menu items ──────────────────────────────────────────────────────────────

const ICON_SX = { fontSize: 22, color: '#433C50' };

const MENU_ITEMS: { icon: React.ReactNode; label: string; section: AccountSection }[] = [
  { icon: <PersonOutlineIcon sx={ICON_SX} />,      label: 'Account',      section: 'account-information' },
  { icon: <Inventory2OutlinedIcon sx={ICON_SX} />, label: 'My Orders',    section: 'orders'              },
  { icon: <NotificationsNoneIcon sx={ICON_SX} />,  label: 'Notification', section: 'notifications'       },
];

// ─── Item row ─────────────────────────────────────────────────────────────────

const MenuItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Box
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      px: '16px',
      py: '10px',
      borderRadius: '6px',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
      '&:hover': { backgroundColor: '#F7F8FB' },
      '&:focus-visible': { outline: '2px solid #476D59', outlineOffset: '2px' },
    }}
  >
    {icon}
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', lineHeight: '20.8px', color: '#433C50', flex: 1 }}>
      {label}
    </Typography>
  </Box>
);

// ─── SettingsPopup ────────────────────────────────────────────────────────────

interface SettingsPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onNavigate: (section: AccountSection) => void;
  onSignOut: () => void;
}

export const SettingsPopup = ({ anchorEl, onClose, onNavigate, onSignOut }: SettingsPopupProps) => {
  const { user } = useAuth();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      disableScrollLock
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            width: 320,
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            mt: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
          },
        },
      }}
    >
      {/* Signed-in user header */}
      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '16px', pt: '16px', pb: '12px', borderBottom: '1px solid #E3E6EC' }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#EEF2F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PersonOutlineIcon sx={{ fontSize: 22, color: '#476D59' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#1A1F1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#6D6777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Menu items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', p: '12px' }}>
        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.label} icon={item.icon} label={item.label} onClick={() => { onNavigate(item.section); onClose(); }} />
        ))}
      </Box>

      {/* Sign out (Action footer — light-gray bar, outlined button) */}
      <Box sx={{ backgroundColor: '#F7F7F7', px: '16px', py: '16px' }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={() => { onSignOut(); onClose(); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { onSignOut(); onClose(); } }}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            height: 40, width: '100%', boxSizing: 'border-box',
            backgroundColor: '#FFFFFF', border: '1px solid #777181', borderRadius: '6px',
            px: '20px', py: '8px', cursor: 'pointer', transition: 'background-color 0.15s',
            '&:hover': { backgroundColor: '#F0F0F0' },
            '&:focus-visible': { outline: '2px solid #476D59', outlineOffset: '2px' },
          }}
        >
          <LogoutOutlinedIcon sx={{ fontSize: 22, color: '#515854' }} />
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '16px', lineHeight: '20.8px', color: '#515854', whiteSpace: 'nowrap' }}>
            Sign out
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default SettingsPopup;
