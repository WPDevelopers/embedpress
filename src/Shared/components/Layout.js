/**
 * Shared Layout Component
 */

import React from 'react';

export const Layout = ({ children }) => {
    return (
        <div className="embedpress-layout">
            <header className="embedpress-header">
                <div className="embedpress-logo">
                    <h1>EmbedPress</h1>
                </div>
                
                <nav className="embedpress-nav">
                    <a href="#dashboard">Dashboard</a>
                    <a href="#analytics">Analytics</a>
                    <a href="#settings">Settings</a>
                </nav>
            </header>
            
            <main className="embedpress-main">
                {children}
            </main>
            
            <footer className="embedpress-footer">
                <p>&copy; 2024 EmbedPress. All rights reserved.</p>
            </footer>
        </div>
    );
};
