import { useState } from "react";
import HeaderSteps from "./HeaderSteps";
import Navigation from "./Navigation";

const EmbedPress = ({ step, setStep, settings, setSettings }) => {
    // Add state for enabled plugins
    const [enabledPlugins, setEnabledPlugins] = useState({});

    const handlePluginToggle = (pluginName) => {
        setEnabledPlugins(prev => ({
            ...prev,
            [pluginName]: !prev[pluginName]
        }));
    };

    const handleSaveSettings = () => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('ep_settings_nonce', quickSetup?.nonce || '');
            formData.append('submit', 'general');
            formData.append('action', 'embedpress_quicksetup_save_settings');

            // Add settings
            for (const key in settings) {
                if (settings.hasOwnProperty(key)) {
                    let value = settings[key];
                    value = typeof value === 'boolean' ? (value ? '1' : '0') : value;
                    formData.append(key, value);
                }
            }

            // Add enabled plugins
            for (const key in enabledPlugins) {
                if (enabledPlugins.hasOwnProperty(key)) {
                    formData.append(`plugin_${key}`, enabledPlugins[key] ? '1' : '0');
                }
            }

            fetch(quickSetup.ajaxurl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Settings saved successfully');
                    resolve();
                } else {
                    reject(new Error('Failed to save settings'));
                }
            })
            .catch(reject);
        });
    };

    const plugins = [
        {
            name: 'NotificationX',
            description: 'Best FOMO Social Proof plugin to boost your sales conversion. Create stunning sales popups & Notification Bar With Elementor support.',
            icon: quickSetup.EMBEDPRESS_QUICKSETUP_ASSETS_URL + 'img/notificationx.svg',
            slug: 'notificationx',
            basename: 'notificationx/notificationx.php'
        },
        {
            name: 'BetterLinks',
            description: 'Best link shortening tool to create, shorten and manage any URL to help you cross-promote your brands & products. Gather analytics reports, run successful marketing campaigns easily & many more',
            icon: quickSetup.EMBEDPRESS_QUICKSETUP_ASSETS_URL + 'img/betterlinks.svg',
            slug: 'betterlinks',
            basename: 'betterlinks/betterlinks.php'
        },
        {
            name: 'BetterDocs',
            description: 'Create and organize your knowledge base, FAQ & documentation page efficiently, making it easy for visitors to find any helpful article quickly and effortlessly.',
            icon: quickSetup.EMBEDPRESS_QUICKSETUP_ASSETS_URL + 'img/betterdocs.svg',
            slug: 'betterdocs',
            basename: 'betterdocs/betterdocs.php',
        },
        {
            name: 'Better Payment',
            description: 'Streamline transactions in Elementor by integrating PayPal & Stripe. Experience advanced analytics, validation, and Elementor forms for secure & efficient payments.',
            icon: quickSetup.EMBEDPRESS_QUICKSETUP_ASSETS_URL + 'img/betterpayments.svg',
            slug: 'better-payment',
            basename: 'better-payment/better-payment.php'
        },
    ]

    return (
        <>
            <HeaderSteps step={step} setStep={setStep} />
            <section className="section epob-embedpress_section">
                <div className="epob-container">
                    <div className="epob-embedpress_header-wrapper">
                        <h3 className="epob-header">Enhance Website Power</h3>
                        <p className="epob-title">
                            Get the powerful plugins for your website that are trusted by 6
                            million+ users and boost your website
                        </p>
                    </div>
                    <div className="epob-products_wrapper">
                        <h3 className="epob-products_header">Products</h3>
                        <div className="epob-products">
                            {plugins.map((plugin, index) => (
                                <div className="epob-row_style" key={plugin.name}>
                                    <div className="flex-1">
                                        <div className="epob-product_info">
                                            <div className="epob-product_icon">
                                                <img src={plugin.icon} alt={plugin.name} />
                                            </div>
                                            <div className="epob-wrapper">
                                                <div className="epob-product_name">
                                                    <h4>{plugin.name}</h4>
                                                </div>
                                                <div className="epob-product_sub-text">
                                                    <p>{plugin.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="epob-toggle_switch epob-width_75px">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label className="epob-switch">
                                                <input 
                                                    type="checkbox"
                                                    checked={!!enabledPlugins[plugin.name]}
                                                    onChange={() => handlePluginToggle(plugin.name)}
                                                />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Navigation
                        step={step}
                        setStep={setStep}
                        backLabel={'Previous'}
                        nextLabel={'Next'}
                        onNextClick={handleSaveSettings}
                    />
                </div>
            </section>
        </>
    );
};

export default EmbedPress;