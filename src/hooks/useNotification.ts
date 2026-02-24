import toast from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

const defaultOptions: NotificationOptions = {
  duration: 4000,
  position: 'top-right',
};

export function useNotification() {
  const notify = (
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ) => {
    const opts = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        return toast.success(message, opts);
      case 'error':
        return toast.error(message, opts);
      case 'warning':
        return toast(message, {
          ...opts,
          icon: '⚠️',
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
      case 'info':
        return toast(message, {
          ...opts,
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        });
      default:
        return toast(message, opts);
    }
  };

  return {
    success: (message: string, options?: NotificationOptions) =>
      notify('success', message, options),
    error: (message: string, options?: NotificationOptions) =>
      notify('error', message, options),
    warning: (message: string, options?: NotificationOptions) =>
      notify('warning', message, options),
    info: (message: string, options?: NotificationOptions) =>
      notify('info', message, options),
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
      options?: NotificationOptions
    ) => {
      return toast.promise(
        promise,
        {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
        },
        options
      );
    },
  };
}
