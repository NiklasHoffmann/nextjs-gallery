'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Allgemeine Error Boundary Component
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error Logging (z.B. an Sentry senden)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert
              variant="danger"
              title="Es ist ein Fehler aufgetreten"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
            >
              <p className="mb-4">
                Die Anwendung ist auf einen unerwarteten Fehler gestoßen. Bitte laden Sie die
                Seite neu oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.
              </p>
              {this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium mb-2">
                    Technische Details
                  </summary>
                  <pre className="mt-2 text-xs bg-danger-100 dark:bg-danger-900/20 p-3 rounded overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="mt-4 flex gap-2">
                <Button onClick={this.resetError} variant="primary" size="sm">
                  Erneut versuchen
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  size="sm"
                >
                  Seite neu laden
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight Error Boundary für kleinere Komponenten
 */
export class ComponentErrorBoundary extends Component<
  { children: ReactNode; componentName?: string },
  State
> {
  constructor(props: { children: ReactNode; componentName?: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `ComponentErrorBoundary (${this.props.componentName || 'Unknown'}) caught an error:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-900/20">
          <p className="text-sm text-danger-800 dark:text-danger-200">
            <strong>{this.props.componentName || 'Diese Komponente'}</strong> konnte nicht geladen
            werden.
          </p>
          {this.state.error && (
            <p className="mt-2 text-xs text-danger-700 dark:text-danger-300">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
