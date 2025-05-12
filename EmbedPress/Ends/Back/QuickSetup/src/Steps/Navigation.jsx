import { useState, useEffect } from "react";

const Navigation = ({ step, setStep, backLabel, nextLabel, onNextClick }) => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Force scroll to top whenever step changes
    useEffect(() => {
        // Direct DOM manipulation to ensure it works in all browsers
        window.scrollTo(0, 0);
    }, [step]);

    const nextStep = async () => {
        if (onNextClick) {
            try {
                await onNextClick();
                // Only proceed to next step if onNextClick succeeds
                setStep(prev => Math.min(prev + 1, 4));
            } catch (error) {
                console.error('Error saving settings:', error);
            }
        } else {
            setStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleComplete = () => {
        // Show success popup
        setShowSuccessPopup(true);

        // Mark setup wizard as completed

        fetch(quickSetup.ajaxurl, {
            method: 'POST',
            body: new URLSearchParams({
                action: 'embedpress_quicksetup_completed',
                ep_qs_settings_nonce: quickSetup.nonce
            }),
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Setup wizard completed');

                    // Automatically hide the popup after 3 seconds
                    setTimeout(() => {
                        setShowSuccessPopup(false);

                        // Redirect to the main EmbedPress dashboard after completion
                        if (typeof quickSetup !== 'undefined' && quickSetup.admin_url) {
                            window.location.href = quickSetup.admin_url + 'admin.php?page=embedpress';
                        }
                    }, 3000);
                } else {
                    console.error('Failed to complete setup wizard:', data);
                }
            })
            .catch(error => {
                console.error('Error completing setup wizard:', error);
            });


    };

    return (
        <>
            <div className="epob-previous_next-btn_wrapper">
                {step > 1 && (
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo(0, 0);
                            prevStep();
                        }}
                        className="epob-btn epob-previous_btn"
                        role="button"
                    >
                        <span>
                            <svg
                                width="6"
                                height="13"
                                viewBox="0 0 6 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.25 11.75L0.75 6.5L5.25 1.25"
                                    stroke="#5B4E96"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span>{backLabel}</span>
                    </a>
                )}
                {step < 4 ? (
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo(0, 0);
                            nextStep();
                        }}
                        className="epob-btn epob-next_btn"
                        role="button"
                    >
                        <span>{nextLabel}</span>
                        <span>
                            <svg
                                width="6"
                                height="13"
                                viewBox="0 0 6 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.75 1.25L5.25 6.5L0.75 11.75"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </a>
                ) : (
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo(0, 0);
                            handleComplete();
                        }}
                        className="epob-btn epob-next_btn"
                        role="button"
                    >
                        <span>Continue without upgrading</span>
                    </a>
                )}
            </div>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="epob-success-popup">
                    <div className="epob-success-popup-content">
                        <div className="epob-success-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#00CC76" />
                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="epob-success-message">
                            <h3>Setup Complete!</h3>
                            <p>EmbedPress has been successfully configured and is ready to use.</p>
                            <p>You'll be redirected to the dashboard shortly.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
