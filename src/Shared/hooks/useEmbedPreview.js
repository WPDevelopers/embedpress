/**
 * useEmbedPreview Hook
 * 
 * Hook for handling embed preview functionality.
 */

import { useState, useEffect } from 'react';

const useEmbedPreview = (url) => {
    const [embedData, setEmbedData] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setEmbedData(null);
            setError(null);
            return;
        }

        setIsValidating(true);
        setError(null);

        // Simulate API call for now
        const timer = setTimeout(() => {
            setEmbedData({
                html: `<div style="padding: 20px; border: 1px solid #ddd; text-align: center;">
                    <p>Embed preview for: ${url}</p>
                    <p><em>This is a placeholder preview</em></p>
                </div>`,
                provider: 'Unknown',
                title: 'Embed Preview'
            });
            setIsValidating(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [url]);

    return {
        embedData,
        isValidating,
        error
    };
};

export default useEmbedPreview;
