/**
 * Alternative approach to remove jx-svg-round-button
 * This script intercepts iframe creation and modifies the content
 */

(function() {
    'use strict';

    // Store original createElement method
    const originalCreateElement = document.createElement;

    // Override createElement to intercept iframe creation
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'iframe') {
            // Add load event listener to remove round buttons
            element.addEventListener('load', function() {
                setTimeout(() => {
                    try {
                        const iframeDoc = element.contentDocument || element.contentWindow.document;
                        if (iframeDoc) {
                            // Remove existing round buttons
                            const roundButtons = iframeDoc.querySelectorAll('.jx-svg-round-button, .jx-carousel-title');
                            roundButtons.forEach(button => {
                                button.style.display = 'none';
                                button.remove();
                            });

                            // Add CSS to prevent future round buttons
                            const style = iframeDoc.createElement('style');
                            style.textContent = '.jx-svg-round-button, .jx-carousel-title { display: none !important; }';
                            iframeDoc.head.appendChild(style);

                            // Watch for dynamically added round buttons
                            const observer = new MutationObserver(function(mutations) {
                                mutations.forEach(function(mutation) {
                                    mutation.addedNodes.forEach(function(node) {
                                        if (node.nodeType === 1) {
                                            if (node.classList && node.classList.contains('jx-svg-round-button')) {
                                                node.remove();
                                            } else if (node.querySelectorAll) {
                                                const newRoundButtons = node.querySelectorAll('.jx-svg-round-button, .jx-carousel-title');
                                                newRoundButtons.forEach(button => button.remove());
                                            }
                                        }
                                    });
                                });
                            });

                            observer.observe(iframeDoc.body, {
                                childList: true,
                                subtree: true
                            });
                        }
                    } catch (e) {
                        // Cross-origin iframe, try alternative approach
                        console.log('Cross-origin iframe detected, using alternative method');
                        
                        // Try to modify the iframe src to include custom CSS
                        const src = element.getAttribute('src');
                        if (src && !src.includes('hide-round-button')) {
                            // This would need to be implemented based on the specific iframe source
                            console.log('Would need to modify iframe source:', src);
                        }
                    }
                }, 100);
            });
        }
        
        return element;
    };

    // Also handle existing iframes
    function processExistingIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!iframe.dataset.processedForRoundButton) {
                iframe.dataset.processedForRoundButton = 'true';
                
                if (iframe.contentDocument) {
                    // Same-origin iframe
                    try {
                        const iframeDoc = iframe.contentDocument;
                        const roundButtons = iframeDoc.querySelectorAll('.jx-svg-round-button, .jx-carousel-title');
                        roundButtons.forEach(button => button.remove());
                        
                        const style = iframeDoc.createElement('style');
                        style.textContent = '.jx-svg-round-button, .jx-carousel-title { display: none !important; }';
                        iframeDoc.head.appendChild(style);
                    } catch (e) {
                        console.log('Cannot access iframe content');
                    }
                } else {
                    // Cross-origin iframe, add load listener
                    iframe.addEventListener('load', function() {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            if (iframeDoc) {
                                const roundButtons = iframeDoc.querySelectorAll('.jx-svg-round-button, .jx-carousel-title');
                                roundButtons.forEach(button => button.remove());
                            }
                        } catch (e) {
                            console.log('Cross-origin iframe, cannot access content');
                        }
                    });
                }
            }
        });
    }

    // Process existing iframes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processExistingIframes);
    } else {
        processExistingIframes();
    }

    // Watch for new iframes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.tagName === 'IFRAME') {
                        processExistingIframes();
                    } else if (node.querySelectorAll) {
                        const newIframes = node.querySelectorAll('iframe');
                        if (newIframes.length > 0) {
                            processExistingIframes();
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
