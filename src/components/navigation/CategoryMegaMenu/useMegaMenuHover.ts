import { useCallback, useRef, useState } from 'react';

export function useMegaMenuHover(closeDelay = 150) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const open = useCallback((id: string) => {
    cancelClose();
    setOpenMenuId(id);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    timerRef.current = setTimeout(() => setOpenMenuId(null), closeDelay);
  }, [cancelClose, closeDelay]);

  const closeImmediate = useCallback(() => {
    cancelClose();
    setOpenMenuId(null);
  }, [cancelClose]);

  return { openMenuId, open, scheduleClose, cancelClose, closeImmediate };
}
