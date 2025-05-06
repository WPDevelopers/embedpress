import { useState, useEffect } from "react";
import HeaderSteps from "./HeaderSteps";
import Navigation from "./Navigation";
import Check from "../Icons/Check";
import External from "../Icons/External";
import RocketFill from "../Icons/RocketFill";
import Code from "../Icons/Code";
import Support from "../Icons/Help";

const UpgradePro = ({ step, setStep }) => {
    // State to track which items are currently processing
    const [processingItems, setProcessingItems] = useState({
        dashboard: false,
        integration: false,
        performance: false
    });

    // Effect to simulate processing with staggered timing
    useEffect(() => {
        // Start processing dashboard immediately
        setProcessingItems(prev => ({ ...prev, dashboard: true }));

        // Start processing integration after 1.5 seconds
        const integrationTimer = setTimeout(() => {
            setProcessingItems(prev => ({ ...prev, integration: true }));
        }, 1500);

        // Start processing performance after 3 seconds
        const performanceTimer = setTimeout(() => {
            setProcessingItems(prev => ({ ...prev, performance: true }));
        }, 3000);

        // Clean up timers
        return () => {
            clearTimeout(integrationTimer);
            clearTimeout(performanceTimer);
        };
    }, []);

    return (
        <>
            <HeaderSteps step={step} setStep={setStep} />


            <section className="section epob-upgrade_to-pro_section">
                <div className="epob-container">
                    <div className="epob-upgrade_to-pro_header-wrapper">
                        <h3 className="epob-header">Upgrade to EmbedPress PRO</h3>
                        <p className="epob-title">
                            Enhance embedding capabilities with advanced and exclusive controls,
                            customizations, and functionalities.
                        </p>
                    </div>
                    <div className="epob-upgrade_to-pro_info-wrapper">
                        <div className="epob-utp_box">
                            <h3 className="epob-utp_box-header">Configuring Your Setup</h3>
                            <p className="epob-utp_title">
                                We are setting things up for you to ensure the best possible
                                experience.
                            </p>
                            <ul className="epob-configuring_list">
                                <li className="epob-configuring_list-item epob-header">
                                    <span className="epob-check_icon">
                                        {processingItems.dashboard ? <Check /> : <div className="epob-spinner"></div>}
                                    </span>
                                    <span>Personalizing Your Dashboard</span>
                                </li>
                                <li className="epob-configuring_list-item">
                                    <span className="epob-check_icon">
                                        {processingItems.integration ? <Check /> : <div className="epob-spinner"></div>}
                                    </span>
                                    <span>Checking Integration</span>
                                </li>
                                <li className="epob-configuring_list-item">
                                    <span className="epob-check_icon">
                                        {processingItems.performance ? <Check /> : <div className="epob-spinner"></div>}
                                    </span>
                                    <span>Optimizing Performance</span>
                                </li>
                            </ul>
                        </div>
                        <div className="epob-utp_box epob-linear_border">
                            <h3 className="epob-utp_box-header">
                                Why upgrade to Premium Version?
                            </h3>
                            <p className="epob-utp_title">
                                The premium version helps us to continue development of the product
                                incorporating even more features and enhancements. You will also get
                                world class support from our dedicated team, 24/7.{" "}
                            </p>
                            <div className="epob-row">
                                <div className="epob-col_5">
                                    <div className="epob-pro_features">
                                        <h4 className="epob-features_header">
                                            <span>Exclusive</span>
                                            <span> PRO Features</span>
                                        </h4>
                                        <ul className="epob-pro_features-list">
                                            <li className="epob-pro_features-list_item">
                                                <span className="epob-check_icon">
                                                    <Check />
                                                </span>
                                                <span>Lazy Loading</span>
                                            </li>
                                            <li className="epob-pro_features-list_item">
                                                <span className="epob-check_icon">
                                                    <Check />
                                                </span>
                                                <span>Custom Branding</span>
                                            </li>
                                            <li className="epob-pro_features-list_item">
                                                <span className="epob-check_icon">
                                                    <Check />
                                                </span>
                                                <span>Content Protection</span>
                                            </li>
                                            <li className="epob-pro_features-list_item">
                                                <span className="epob-check_icon">
                                                    <Check />
                                                </span>
                                                <span>Video &amp; Audio Custom Player</span>
                                            </li>
                                            <li className="epob-pro_features-list_item">
                                                <span className="epob-check_icon">
                                                    <Check />
                                                </span>
                                                <span>Advanced Customization Options</span>
                                            </li>
                                            <li className="epob-pro_features-list_item">
                                                <span className="epob-check_icon">
                                                    <Check />
                                                </span>
                                                <span>24/7 Customer Support</span>
                                            </li>
                                        </ul>
                                        <a target="_blank" href="https://embedpress.com/#pricing" className="epob-uptp_btn">
                                            Upgrade To Pro{" "}
                                            <span>
                                                <External />
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div className="epob-col_7">
                                    <div className="epob-img_wrapper">
                                        <img src="./img/Group 39932.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="epob-utp_box">
                            <h3 className="epob-utp_box-header">Documentation</h3>
                            <div className="epob-documentation_info">
                                <div className="epob-row">
                                    <div className="epob-col_4">
                                        <div className="epob-info_box">
                                            <div className="epob-info_icon">
                                                <span>
                                                    <RocketFill />
                                                </span>
                                            </div>
                                            <h4 className="epob-info_box-header">Getting Started</h4>
                                            <p className="epob-info_box-title">
                                                Get started by spending some time with the documentation to get familiar with EmbedPress. Build awesome websites for you or your clients with ease.
                                            </p>
                                            <a href="https://embedpress.com/documentation/" className="epob-info_box-btn">
                                                Explore{" "}
                                                <span>
                                                    <svg
                                                        width={6}
                                                        height={9}
                                                        viewBox="0 0 6 9"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M1.5 7.5L4.5 4.5L1.5 1.5"
                                                            stroke="#5B4E96"
                                                            strokeWidth="1.2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="epob-col_4">
                                        <div className="epob-info_box">
                                            <div className="epob-info_icon">
                                                <span>
                                                    <Code />
                                                </span>
                                            </div>
                                            <h4 className="epob-info_box-header">Embed Sources</h4>
                                            <p className="epob-info_box-title">
                                                Easily get started with this easy setup wizard and complete
                                                setting{" "}
                                            </p>
                                            <a href="https://embedpress.com/sources/" className="epob-info_box-btn">
                                                Explore{" "}
                                                <span>
                                                    <svg
                                                        width={6}
                                                        height={9}
                                                        viewBox="0 0 6 9"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M1.5 7.5L4.5 4.5L1.5 1.5"
                                                            stroke="#5B4E96"
                                                            strokeWidth="1.2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="epob-col_4">
                                        <div className="epob-info_box">
                                            <div className="epob-info_icon">
                                                <span>
                                                    <Support />
                                                </span>
                                            </div>
                                            <h4 className="epob-info_box-header">Need Help?</h4>
                                            <p className="epob-info_box-title">Stuck with something? Get help from the community on WordPress.org Forum or Facebook Community. In case of emergency, initiate a live chat at WPDeveloper website.
                                            </p>
                                            <a href="https://wpdeveloper.com/support/" className="epob-info_box-btn">
                                                Explore{" "}
                                                <span>
                                                    <svg
                                                        width={6}
                                                        height={9}
                                                        viewBox="0 0 6 9"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M1.5 7.5L4.5 4.5L1.5 1.5"
                                                            stroke="#5B4E96"
                                                            strokeWidth="1.2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a href="#" className="epob-bocumentation_exp-more_btn">
                                Explore More
                                <span>
                                    <svg
                                        width={6}
                                        height={12}
                                        viewBox="0 0 6 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M0.75 0.75L5.25 6L0.75 11.25"
                                            stroke="#5B4E96"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>

                    <Navigation
                        step={step}
                        setStep={setStep}
                        backLabel={'Previous'}
                        nextLabel={'Continue without upgrading'}
                    />

                </div>
            </section>
        </>

    )
}
export default UpgradePro;