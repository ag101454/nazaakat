import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-serif text-black mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6 text-sm">
              Don't worry, your data is safe. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-3 bg-gold-500 text-white rounded-full font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Refresh Page
              </button>
              <Link 
                to="/" 
                className="block w-full py-3 border-2 border-gray-200 text-gray-600 rounded-full font-medium flex items-center justify-center gap-2"
              >
                <Home size={18} /> Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}