/**
 * useProviderDetection Hook
 * 
 * Hook for detecting the provider from a URL.
 */

import { useMemo } from 'react';

const useProviderDetection = (url) => {
    const { provider, isSupported } = useMemo(() => {
        if (!url) {
            return { provider: null, isSupported: false };
        }

        // Simple provider detection logic
        const providers = [
            { name: 'YouTube', patterns: ['youtube.com', 'youtu.be'] },
            { name: 'Vimeo', patterns: ['vimeo.com'] },
            { name: 'Twitter', patterns: ['twitter.com', 'x.com'] },
            { name: 'Facebook', patterns: ['facebook.com'] },
            { name: 'Instagram', patterns: ['instagram.com'] },
            { name: 'TikTok', patterns: ['tiktok.com'] },
            { name: 'Google Docs', patterns: ['docs.google.com'] },
            { name: 'Google Sheets', patterns: ['sheets.google.com'] },
            { name: 'Google Slides', patterns: ['slides.google.com'] },
        ];

        for (const providerInfo of providers) {
            if (providerInfo.patterns.some(pattern => url.includes(pattern))) {
                return {
                    provider: providerInfo.name,
                    isSupported: true
                };
            }
        }

        return {
            provider: 'Unknown',
            isSupported: false
        };
    }, [url]);

    return { provider, isSupported };
};

export default useProviderDetection;
