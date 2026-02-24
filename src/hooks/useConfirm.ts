import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface UseConfirmReturn {
  isOpen: boolean;
  confirm: (
    onConfirm: () => void | Promise<void>,
    options: ConfirmOptions
  ) => void;
  close: () => void;
  options: ConfirmOptions;
  onConfirmAction: (() => void | Promise<void>) | null;
}

export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
  });
  const [onConfirmAction, setOnConfirmAction] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const confirm = useCallback(
    (onConfirm: () => void | Promise<void>, opts: ConfirmOptions) => {
      setOptions(opts);
      setOnConfirmAction(() => onConfirm);
      setIsOpen(true);
    },
    []
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setOnConfirmAction(null);
  }, []);

  return {
    isOpen,
    confirm,
    close,
    options,
    onConfirmAction,
  };
}
