import { logSafeError } from '../utils/safeLogger';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logSafeError('ErrorBoundary capturou um erro não tratado:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafb', color: '#101729', fontFamily: 'sans-serif', padding: '24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '480px', background: '#ffffff', border: '1px solid #dfe5e9', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(16, 23, 41, 0.08)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fdf2f2', color: '#cb5353', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              ⚠
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>
              Ops! Algo deu errado
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#607286', lineHeight: '1.5' }}>
              Ocorreu um problema inesperado ao carregar esta página.
            </p>
            <button
              style={{ height: '40px', padding: '0 24px', background: '#75aa7e', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
