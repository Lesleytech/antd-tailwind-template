import { useCallback, useMemo, useState } from 'react';

export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => setIsOpen((open) => !open), [setIsOpen]);
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onOpen = useCallback(() => setIsOpen(true), [setIsOpen]);

  return useMemo(() => ({ isOpen, toggle, onClose, onOpen }), [isOpen, toggle, onClose, onOpen]);
}
