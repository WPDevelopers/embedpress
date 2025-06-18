/**
 * Shared Error Boundary Component
 */

import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('EmbedPress Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="embedpress-error-boundary">
                    <h2>Something went wrong</h2>
                    <p>An error occurred while loading this component.</p>
                    <details>
                        <summary>Error details</summary>
                        <pre>{this.state.error?.toString()}</pre>
                    </details>
                    <button 
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="button"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
