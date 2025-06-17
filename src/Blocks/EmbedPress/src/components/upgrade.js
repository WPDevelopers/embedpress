/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";

/**
 * Internal dependencies
 */
import { EPIcon } from "../../../GlobalCoponents/icons";

/**
 * Upgrade Component
 * 
 * Displays upgrade to Pro information and features
 */
export default function Upgrade() {
    const isProPluginActive = typeof window.embedpressObj !== 'undefined' ? window.embedpressObj.is_pro_plugin_active : false;

    // Don't show upgrade panel if Pro is already active
    if (isProPluginActive) {
        return null;
    }

    return (
        <PanelBody 
            title={
                <div className='ep-pannel-icon'>
                    {EPIcon} {__('Upgrade to Pro', 'embedpress')}
                </div>
            } 
            initialOpen={false}
        >
            <div className="ep-upgrade-panel">
                <div className="ep-upgrade-content">
                    <h3>{__('🚀 Unlock Premium Features', 'embedpress')}</h3>
                    
                    <div className="ep-pro-features">
                        <ul>
                            <li>✅ {__('Advanced YouTube Controls', 'embedpress')}</li>
                            <li>✅ {__('Custom Video Player', 'embedpress')}</li>
                            <li>✅ {__('Content Protection', 'embedpress')}</li>
                            <li>✅ {__('Custom Branding & Logo', 'embedpress')}</li>
                            <li>✅ {__('Instagram Hashtag Feeds', 'embedpress')}</li>
                            <li>✅ {__('Advanced Analytics', 'embedpress')}</li>
                            <li>✅ {__('Ad Management', 'embedpress')}</li>
                            <li>✅ {__('Priority Support', 'embedpress')}</li>
                        </ul>
                    </div>

                    <div className="ep-upgrade-buttons">
                        <a 
                            href="https://wpdeveloper.com/in/upgrade-embedpress" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ep-upgrade-btn ep-upgrade-btn-primary"
                        >
                            {__('Upgrade to Pro', 'embedpress')}
                        </a>
                        
                        <a 
                            href="https://embedpress.com/pricing/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ep-upgrade-btn ep-upgrade-btn-secondary"
                        >
                            {__('View Pricing', 'embedpress')}
                        </a>
                    </div>

                    <div className="ep-upgrade-guarantee">
                        <p>
                            <strong>{__('💰 30-Day Money-Back Guarantee', 'embedpress')}</strong>
                        </p>
                        <p>
                            {__('Try EmbedPress Pro risk-free. If you\'re not satisfied, get a full refund within 30 days.', 'embedpress')}
                        </p>
                    </div>
                </div>

                <style jsx>{`
                    .ep-upgrade-panel {
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 8px;
                        color: white;
                        text-align: center;
                    }
                    
                    .ep-upgrade-content h3 {
                        color: white;
                        margin-bottom: 20px;
                        font-size: 18px;
                    }
                    
                    .ep-pro-features {
                        margin: 20px 0;
                    }
                    
                    .ep-pro-features ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        text-align: left;
                        max-width: 300px;
                        margin: 0 auto;
                    }
                    
                    .ep-pro-features li {
                        padding: 5px 0;
                        font-size: 14px;
                        color: #f0f0f0;
                    }
                    
                    .ep-upgrade-buttons {
                        margin: 20px 0;
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .ep-upgrade-btn {
                        padding: 12px 24px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: 600;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        display: inline-block;
                        min-width: 120px;
                    }
                    
                    .ep-upgrade-btn-primary {
                        background: #ff6b6b;
                        color: white;
                        border: 2px solid #ff6b6b;
                    }
                    
                    .ep-upgrade-btn-primary:hover {
                        background: #ff5252;
                        border-color: #ff5252;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
                    }
                    
                    .ep-upgrade-btn-secondary {
                        background: transparent;
                        color: white;
                        border: 2px solid white;
                    }
                    
                    .ep-upgrade-btn-secondary:hover {
                        background: white;
                        color: #667eea;
                        transform: translateY(-2px);
                    }
                    
                    .ep-upgrade-guarantee {
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .ep-upgrade-guarantee p {
                        margin: 5px 0;
                        font-size: 13px;
                        color: #f0f0f0;
                    }
                    
                    .ep-upgrade-guarantee strong {
                        color: #ffd700;
                    }
                `}</style>
            </div>
        </PanelBody>
    );
}
