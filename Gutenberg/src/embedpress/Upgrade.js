import React, { useState, useEffect, useRef } from "react";
import { select } from '@wordpress/data';
import { useSelect } from '@wordpress/data';

const Upgrade = () => {
    const [ratingClosed, setRatingClosed] = useState(() => localStorage.getItem("ratingClosed") === "true");
    const [rating, setRating] = useState(0);
    const [showThank, setShowThank] = useState(false);
    const [showRateButton, setShowRateButton] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    const textareaRef = useRef(null);

    const currentUser = embedpressObj.current_user || {};
    const isProPluginActive = embedpressObj.is_pro_plugin_active;


    const handleCloseRating = () => {
        setRatingClosed(true);
    };

    const sendFiveStarRating = () => {
        const data = {
            name: currentUser.display_name,
            email: currentUser.user_email,
            rating: '5',
            message: ''
        };

        fetch('/wp-json/embedpress/v1/send-feedback', { // Updated API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setShowThank(true);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to send email.');
            });
    }

    const handleRating = (selectedRating) => {
        setRating(selectedRating);

        if (selectedRating < 5) {
            setTimeout(() => {
                setShowThank(false);
                localStorage.setItem("ratingClosed", true);
            }, 1000 * 10);

            console.log({ selectedRating });

            setShowForm(true);
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 0);
        } else {
            setShowThank(true);
            setShowRateButton(true);
            sendFiveStarRating();

            setTimeout(() => {
                setShowThank(false);
                localStorage.setItem("ratingClosed", true);
            }, 1000 * 60);
        }
    };

    const handlFiveStarRating = () => {
        window.open("https://wordpress.org/support/plugin/embedpress/reviews/?filter=4#new-post", "_blank");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            name: currentUser.display_name,
            email: currentUser.user_email,
            rating: rating,
            message: formData.get('message')
        };

        fetch('/wp-json/embedpress/v1/send-feedback', { // Updated API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setShowThank(true);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to send email.');
            });
    };


    return (
        <div className="plugin-rating">
            {
                !showForm && !showThank && !ratingClosed && (
                    <frameElement>
                        <h4>Share your feeling</h4>
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className="star"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill={i < rating ? "#FFD700" : "#B1B8C2"} // Fill selected stars
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => handleRating(i + 1)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <path d="M4.80913 4.28162L1.08747 4.82121L1.02155 4.83462C0.921766 4.86111 0.830798 4.91361 0.757938 4.98676C0.685079 5.0599 0.632937 5.15107 0.606838 5.25096C0.580738 5.35085 0.581617 5.45588 0.609384 5.55531C0.637151 5.65475 0.690811 5.74504 0.764885 5.81695L3.46105 8.44137L2.82522 12.1485L2.81763 12.2126C2.81153 12.3158 2.83296 12.4188 2.87973 12.511C2.9265 12.6032 2.99694 12.6813 3.08383 12.7373C3.17072 12.7934 3.27094 12.8253 3.37422 12.8299C3.47751 12.8344 3.58015 12.8114 3.67163 12.7633L7.00013 11.0133L10.3211 12.7633L10.3794 12.7901C10.4757 12.828 10.5803 12.8397 10.6826 12.8238C10.7848 12.808 10.881 12.7652 10.9613 12.6999C11.0416 12.6345 11.103 12.5491 11.1394 12.4522C11.1757 12.3553 11.1856 12.2504 11.168 12.1485L10.5316 8.44137L13.229 5.81637L13.2745 5.76679C13.3395 5.68674 13.3821 5.59089 13.398 5.489C13.4139 5.38712 13.4025 5.28284 13.3649 5.1868C13.3274 5.09075 13.2651 5.00637 13.1843 4.94225C13.1036 4.87813 13.0073 4.83657 12.9052 4.82179L9.18355 4.28162L7.51989 0.909955C7.47175 0.812267 7.39722 0.730005 7.30475 0.672482C7.21227 0.61496 7.10554 0.584473 6.99663 0.584473C6.88773 0.584473 6.781 0.61496 6.68852 0.672482C6.59605 0.730005 6.52152 0.812267 6.47338 0.909955L4.80913 4.28162Z" />
                                </svg>
                            ))}
                        </div>
                    </frameElement>
                )
            }

            {
                showForm && !showThank && !ratingClosed && (
                    <div className="feedback-submit-container">
                        <h5 className="help-message">Help us make it better!</h5>
                        <p className="form-description">Description</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <textarea name="message" ref={textareaRef} placeholder="Describe your issue in details" type="text" rows={4} className="form-control"></textarea>
                            </div>
                            <div className="form-group">
                                <button className="submit-button" type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                )
            }
            {showThank && !ratingClosed && (
                <div className="tankyou-msg-container">
                    <h5 className="help-message">Thanks for sharing!</h5>
                    <p className="thank-you-message">We really appreciate you taking the time to share your thoughts with us. </p>

                    {
                        showRateButton && (
                            <button className="rating-button" onClick={handlFiveStarRating}>
                                Rate the plugin
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 2.083 6.25 5l-2.5 2.917" stroke="#5B4E96" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                            </button>
                        )
                    }
                </div>
            )}
            <p>We are here to help</p>
            <a href="https://embedpress.com/?support=true" target="_blank" className="chat-button"><svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)" fill="#fff"><path d="M7.93.727H1.555C.97.727.5 1.198.5 1.782V6c0 .584.471 1.055 1.055 1.055h.351V8.11c0 .254.263.438.52.31.008-.008.022-.008.029-.015 1.934-1.297 1.5-1.008 1.933-1.294a.35.35 0 0 1 .19-.056H7.93c.583 0 1.054-.47 1.054-1.055V1.782c0-.584-.47-1.055-1.054-1.055M5.117 4.946h-2.86c-.463 0-.465-.703 0-.703h2.86c.464 0 .466.703 0 .703m2.11-1.406h-4.97c-.463 0-.465-.704 0-.704h4.97c.463 0 .465.704 0 .704" /><path d="M11.445 3.54H9.687V6c0 .97-.787 1.758-1.757 1.758H4.684l-.668.443v.612c0 .584.47 1.055 1.054 1.055h3.457l2.018 1.35c.276.153.549-.033.549-.296V9.868h.351c.584 0 1.055-.471 1.055-1.055V4.594c0-.583-.471-1.054-1.055-1.054" /></g><defs><clipPath id="a"><path fill="#fff" d="M.5 0h12v12H.5z" /></clipPath></defs></svg>Initiate Chat</a>

            {
                !isProPluginActive && (
                    <div className="upgrade-box">
                        <h5>Want Advanced Features?</h5>
                        <p>Get more powerful widgets & extensions to elevate your Elementor website</p>
                        <a href="https://embedpress.com/#pricing" target="_blank" className="upgrade-link">Upgrade to PRO</a>
                    </div>
                )
            }

        </div>
    );
};

export default Upgrade;
