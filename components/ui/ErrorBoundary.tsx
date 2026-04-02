'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
