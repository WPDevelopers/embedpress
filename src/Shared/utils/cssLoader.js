/**
 * Asset Loader Utility for EmbedPress
 *
 * This utility helps manage CSS and JS loading in different scenarios:
 * 1. Dynamic CSS/JS imports in React components
 * 2. Third-party package CSS/JS loading
 * 3. Conditional CSS/JS loading based on features
 * 4. CSS/JS dependency management
 */

/**
 * Dynamically load CSS file
 * @param {string} cssPath - Path to CSS file
 * @param {string} id - Unique identifier for the CSS
 * @returns {Promise} Promise that resolves when CSS is loaded
 */
export const loadCSS = (cssPath, id) => {
    return new Promise((resolve, reject) => {
        // Check if CSS is already loaded
        if (document.getElementById(id)) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load CSS: ${cssPath}`));
        
        document.head.appendChild(link);
    });
};

/**
 * Dynamically load JS file
 * @param {string} jsPath - Path to JS file
 * @param {string} id - Unique identifier for the JS
 * @returns {Promise} Promise that resolves when JS is loaded
 */
export const loadJS = (jsPath, id) => {
    return new Promise((resolve, reject) => {
        // Check if JS is already loaded
        if (document.getElementById(id)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.type = 'text/javascript';
        script.src = jsPath;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load JS: ${jsPath}`));

        document.head.appendChild(script);
    });
};

/**
 * Load multiple CSS files
 * @param {Array} cssFiles - Array of {path, id} objects
 * @returns {Promise} Promise that resolves when all CSS files are loaded
 */
export const loadMultipleCSS = (cssFiles) => {
    const promises = cssFiles.map(({ path, id }) => loadCSS(path, id));
    return Promise.all(promises);
};

/**
 * Load multiple JS files
 * @param {Array} jsFiles - Array of {path, id} objects
 * @returns {Promise} Promise that resolves when all JS files are loaded
 */
export const loadMultipleJS = (jsFiles) => {
    const promises = jsFiles.map(({ path, id }) => loadJS(path, id));
    return Promise.all(promises);
};

/**
 * Load multiple assets (CSS and JS)
 * @param {Object} assets - Object with css and js arrays
 * @returns {Promise} Promise that resolves when all assets are loaded
 */
export const loadMultipleAssets = ({ css = [], js = [] }) => {
    const cssPromises = css.map(({ path, id }) => loadCSS(path, id));
    const jsPromises = js.map(({ path, id }) => loadJS(path, id));
    return Promise.all([...cssPromises, ...jsPromises]);
};

/**
 * Remove CSS file
 * @param {string} id - ID of the CSS to remove
 */
export const removeCSS = (id) => {
    const link = document.getElementById(id);
    if (link) {
        link.remove();
    }
};

/**
 * Remove JS file
 * @param {string} id - ID of the JS to remove
 */
export const removeJS = (id) => {
    const script = document.getElementById(id);
    if (script) {
        script.remove();
    }
};

/**
 * Asset Manager for feature-based loading
 */
export class AssetManager {
    constructor() {
        this.loadedCSS = new Set();
        this.loadedJS = new Set();
        this.cssMap = new Map();
        this.jsMap = new Map();
        this.initializeAssetMaps();
    }

    /**
     * Initialize CSS and JS mapping for different features
     */
    initializeAssetMaps() {
        // Get the assets URL from WordPress
        const assetsUrl = window.embedpressAssets?.url || '/wp-content/plugins/embedpress/assets/';

        // CSS mappings
        this.cssMap.set('plyr', {
            path: `${assetsUrl}css/plyr.css`,
            dependencies: [],
            features: ['custom-player', 'video-embed']
        });

        this.cssMap.set('carousel', {
            path: `${assetsUrl}css/carousel.min.css`,
            dependencies: [],
            features: ['instagram-carousel', 'youtube-channel']
        });

        this.cssMap.set('embedpress', {
            path: `${assetsUrl}css/embedpress.css`,
            dependencies: [],
            features: ['all']
        });

        this.cssMap.set('elementor', {
            path: `${assetsUrl}css/embedpress-elementor.css`,
            dependencies: ['embedpress'],
            features: ['elementor-widget']
        });

        // Third-party CSS
        this.cssMap.set('optimizely-css', {
            path: `${assetsUrl}css/vendor/optimizely.css`,
            dependencies: [],
            features: ['ab-testing', 'analytics']
        });

        // JS mappings
        this.jsMap.set('plyr-polyfilled', {
            path: `${assetsUrl}js/plyr.polyfilled.js`,
            dependencies: [],
            features: ['custom-player', 'video-embed']
        });

        this.jsMap.set('initplyr', {
            path: `${assetsUrl}js/initplyr.js`,
            dependencies: ['plyr-polyfilled'],
            features: ['custom-player', 'video-embed']
        });

        this.jsMap.set('vimeo-player', {
            path: `${assetsUrl}js/vimeo-player.js`,
            dependencies: [],
            features: ['vimeo-embed', 'video-embed']
        });

        this.jsMap.set('carousel', {
            path: `${assetsUrl}js/carousel.min.js`,
            dependencies: [],
            features: ['instagram-carousel', 'youtube-channel']
        });

        this.jsMap.set('initCarousel', {
            path: `${assetsUrl}js/initCarousel.js`,
            dependencies: ['carousel'],
            features: ['instagram-carousel', 'youtube-channel']
        });

        this.jsMap.set('pdfobject', {
            path: `${assetsUrl}js/pdfobject.js`,
            dependencies: [],
            features: ['pdf-embed', 'document-embed']
        });

        this.jsMap.set('front', {
            path: `${assetsUrl}js/front.js`,
            dependencies: [],
            features: ['all']
        });

        // Third-party JS
        this.jsMap.set('optimizely-js', {
            path: `${assetsUrl}js/vendor/optimizely.js`,
            dependencies: [],
            features: ['ab-testing', 'analytics']
        });
    }

    /**
     * Load CSS for specific features
     * @param {Array|string} features - Feature name(s)
     * @returns {Promise} Promise that resolves when CSS is loaded
     */
    async loadForFeatures(features) {
        const featureArray = Array.isArray(features) ? features : [features];
        const cssToLoad = [];

        // Find CSS files that match the features
        for (const [cssId, cssInfo] of this.cssMap) {
            const shouldLoad = cssInfo.features.includes('all') || 
                             cssInfo.features.some(feature => featureArray.includes(feature));
            
            if (shouldLoad && !this.loadedCSS.has(cssId)) {
                cssToLoad.push({ cssId, cssInfo });
            }
        }

        // Sort by dependencies
        const sortedCSS = this.sortByDependencies(cssToLoad);
        
        // Load CSS files in order
        for (const { cssId, cssInfo } of sortedCSS) {
            try {
                await loadCSS(cssInfo.path, `embedpress-${cssId}`);
                this.loadedCSS.add(cssId);
                console.log(`✅ Loaded CSS: ${cssId}`);
            } catch (error) {
                console.error(`❌ Failed to load CSS: ${cssId}`, error);
            }
        }
    }

    /**
     * Sort CSS files by dependencies
     * @param {Array} cssToLoad - Array of CSS to load
     * @returns {Array} Sorted array
     */
    sortByDependencies(cssToLoad) {
        const sorted = [];
        const visited = new Set();
        
        const visit = (cssId) => {
            if (visited.has(cssId)) return;
            visited.add(cssId);
            
            const cssInfo = this.cssMap.get(cssId);
            if (cssInfo) {
                // Visit dependencies first
                cssInfo.dependencies.forEach(dep => visit(dep));
                
                // Add current CSS if it's in the load list
                const cssItem = cssToLoad.find(item => item.cssId === cssId);
                if (cssItem && !sorted.includes(cssItem)) {
                    sorted.push(cssItem);
                }
            }
        };

        cssToLoad.forEach(({ cssId }) => visit(cssId));
        return sorted;
    }

    /**
     * Preload CSS for better performance
     * @param {Array|string} features - Feature name(s)
     */
    preloadForFeatures(features) {
        const featureArray = Array.isArray(features) ? features : [features];
        
        for (const [cssId, cssInfo] of this.cssMap) {
            const shouldPreload = cssInfo.features.some(feature => featureArray.includes(feature));
            
            if (shouldPreload && !this.loadedCSS.has(cssId)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = cssInfo.path;
                document.head.appendChild(link);
            }
        }
    }

    /**
     * Check if CSS is loaded
     * @param {string} cssId - CSS identifier
     * @returns {boolean} Whether CSS is loaded
     */
    isLoaded(cssId) {
        return this.loadedCSS.has(cssId);
    }

    /**
     * Get loaded CSS list
     * @returns {Array} Array of loaded CSS IDs
     */
    getLoadedCSS() {
        return Array.from(this.loadedCSS);
    }
}

// Create global CSS manager instance
export const cssManager = new CSSManager();

/**
 * React hook for loading CSS based on features
 * @param {Array|string} features - Feature name(s)
 * @param {boolean} preload - Whether to preload CSS
 */
export const useCSS = (features, preload = false) => {
    const [loading, setLoading] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadCSS = async () => {
            setLoading(true);
            setError(null);
            
            try {
                if (preload) {
                    cssManager.preloadForFeatures(features);
                }
                
                await cssManager.loadForFeatures(features);
                setLoaded(true);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadCSS();
    }, [features, preload]);

    return { loading, loaded, error };
};

/**
 * Utility for handling third-party package CSS
 */
export const ThirdPartyCSS = {
    /**
     * Load Optimizely CSS
     */
    loadOptimizely: () => cssManager.loadForFeatures(['ab-testing']),
    
    /**
     * Load analytics CSS
     */
    loadAnalytics: () => cssManager.loadForFeatures(['analytics']),
    
    /**
     * Load custom package CSS
     * @param {string} packageName - Package name
     * @param {string} cssPath - Path to CSS file
     */
    loadCustom: async (packageName, cssPath) => {
        try {
            await loadCSS(cssPath, `third-party-${packageName}`);
            console.log(`✅ Loaded third-party CSS: ${packageName}`);
        } catch (error) {
            console.error(`❌ Failed to load third-party CSS: ${packageName}`, error);
        }
    }
};

// Export default CSS manager
export default cssManager;
