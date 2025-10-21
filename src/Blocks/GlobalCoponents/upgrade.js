const { useState, useEffect, useRef } = wp.element;


const Upgrade = () => {
    const isEmbedpressFeedbackSubmited = embedpressGutenbergData.is_embedpress_feedback_submited;
    const turn_off_rating_help = Boolean(Number(embedpressGutenbergData.turn_off_rating_help));

    const [ratingClosed, setRatingClosed] = useState(() => localStorage.getItem("ratingClosed") === "true");
    const [rating, setRating] = useState(5);
    const [showThank, setShowThank] = useState(false);
    const [showRateButton, setShowRateButton] = useState(false);
    const [loading, setLoading] = useState(false);

    const [hover, setHover] = useState(0);

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    const textareaRef = useRef(null);

    const currentUser = embedpressGutenbergData.currentUser || {};
    const isProPluginActive = embedpressGutenbergData.isProPluginActive;

    // Get analytics page URL
    const analyticsUrl = embedpressGutenbergData.adminUrl ?
        embedpressGutenbergData.adminUrl + 'admin.php?page=embedpress-analytics' :
        '/wp-admin/admin.php?page=embedpress-analytics';


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

        fetch('/wp-json/embedpress/v1/send-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': embedpressGutenbergData.nonce || wpApiSettings.nonce
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                // Check if response is ok (status 200-299)
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // Success - show thank you message only on successful response
                setShowThank(true);
                setShowRateButton(true);
                localStorage.setItem("ratingClosed", true);
            })
            .catch(error => {
                console.error('Error:', error);

                // Show user-friendly error message
                const errorMessage = error.message || 'Failed to send feedback. Please try again.';
                alert(errorMessage);
            });
    }

    const handleRating = (selectedRating) => {
        setRating(selectedRating);

        if (selectedRating < 5) {

            setShowForm(true);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 0);
        } else {
            // Only send the rating, don't show thank you message yet
            // Thank you message will be shown after successful API response
            sendFiveStarRating();
        }
    };

    const handlFiveStarRating = () => {
        window.open("https://wordpress.org/support/plugin/embedpress/reviews/#new-post", "_blank");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.target);
        const data = {
            name: currentUser.display_name,
            email: currentUser.user_email,
            rating: rating,
            message: formData.get('message')
        };

        fetch('/wp-json/embedpress/v1/send-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': embedpressGutenbergData.nonce || wpApiSettings.nonce
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                // Check if response is ok (status 200-299)
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // Success - show thank you message
                setShowThank(true);
                setShowForm(false);
                localStorage.setItem("ratingClosed", true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);

                // Show user-friendly error message
                const errorMessage = error.message || 'Failed to send feedback. Please try again.';
                alert(errorMessage);
            });
    };

    const thankMsgHeading = rating == 5 ? 'We’re glad that you liked us! 😍' : 'We appreciate it!';
    const thankMsgDes = rating == 5 ? 'If you don’t mind, could you take 30 seconds to review us on WordPress? Your feedback will help us improve and grow. Thank you in advance! 🙏' : 'A heartfelt gratitude for managing the time to share your thoughts with us.';

    if (!turn_off_rating_help) {
        return null;
    }

    // just disable rating and feedback
    // return null;

    return (

        <div className={`plugin-rating${!turn_off_rating_help ? ' turn_off_ratting_help' : ''}`}>

            {/* just disabled rating and feedback */}
            {
                turn_off_rating_help && false && (
                    <frameElement>

                        {
                            !showForm && !showThank && !ratingClosed && !isEmbedpressFeedbackSubmited && (
                                <frameElement>
                                    <h4>Rate EmbedPress</h4>
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="star"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill={i < (hover || rating) ? "#FFD700" : "#B1B8C2"} // Gold when hovered/selected, gray otherwise
                                                xmlns="http://www.w3.org/2000/svg"
                                                onClick={() => handleRating(i + 1)}
                                                onMouseEnter={() => setHover(i + 1)}
                                                onMouseLeave={() => { setRating(0); setHover(0) }}
                                                style={{ cursor: "pointer", transition: "fill 0.2s ease-in-out" }}
                                            >
                                                <path d="M4.80913 4.28162L1.08747 4.82121L1.02155 4.83462C0.921766 4.86111 0.830798 4.91361 0.757938 4.98676C0.685079 5.0599 0.632937 5.15107 0.606838 5.25096C0.580738 5.35085 0.581617 5.45588 0.609384 5.55531C0.637151 5.65475 0.690811 5.74504 0.764885 5.81695L3.46105 8.44137L2.82522 12.1485L2.81763 12.2126C2.81153 12.3158 2.83296 12.4188 2.87973 12.511C2.9265 12.6032 2.99694 12.6813 3.08383 12.7373C3.17072 12.7934 3.27094 12.8253 3.37422 12.8299C3.47751 12.8344 3.58015 12.8114 3.67163 12.7633L7.00013 11.0133L10.3211 12.7633L10.3794 12.7901C10.4757 12.828 10.5803 12.8397 10.6826 12.8238C10.7848 12.808 10.881 12.7652 10.9613 12.6999C11.0416 12.6345 11.103 12.5491 11.1394 12.4522C11.1757 12.3553 11.1856 12.2504 11.168 12.1485L10.5316 8.44137L13.229 5.81637L13.2745 5.76679C13.3395 5.68674 13.3821 5.59089 13.398 5.489C13.4139 5.38712 13.4025 5.28284 13.3649 5.1868C13.3274 5.09075 13.2651 5.00637 13.1843 4.94225C13.1036 4.87813 13.0073 4.83657 12.9052 4.82179L9.18355 4.28162L7.51989 0.909955C7.47175 0.812267 7.39722 0.730005 7.30475 0.672482C7.21227 0.61496 7.10554 0.584473 6.99663 0.584473C6.88773 0.584473 6.781 0.61496 6.68852 0.672482C6.59605 0.730005 6.52152 0.812267 6.47338 0.909955L4.80913 4.28162Z" />
                                            </svg>
                                        ))}
                                    </div>
                                </frameElement>
                            )
                        }

                        {
                            showForm && !showThank && !ratingClosed && !isEmbedpressFeedbackSubmited && (
                                <div className="feedback-submit-container">
                                    <h5 className="help-message">Help us make it better!</h5>
                                    <p className="form-description">Please share what went wrong with The EmbedPress so that we can improve further*</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <textarea name="message" ref={textareaRef} placeholder="Describe your issue in details" type="text" rows={4} className="form-control" required></textarea>
                                        </div>
                                        <div className="form-group">
                                            <button
                                                className="submit-button"
                                                type="submit"
                                                disabled={loading} // Disable the button when loading
                                            >
                                                {loading ? "Sending..." : "Send"} {/* Show loading text */}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }



                        {showThank && !ratingClosed && !isEmbedpressFeedbackSubmited && (
                            <div className="tankyou-msg-container">
                                <h5 className="help-message">{thankMsgHeading}</h5>
                                <p className="thank-you-message">{thankMsgDes}</p>

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

                        <p>Need help? We're here</p>
                        <a href="https://embedpress.com/?support=chat" target="_blank" className="chat-button"><svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)" fill="#fff"><path d="M7.93.727H1.555C.97.727.5 1.198.5 1.782V6c0 .584.471 1.055 1.055 1.055h.351V8.11c0 .254.263.438.52.31.008-.008.022-.008.029-.015 1.934-1.297 1.5-1.008 1.933-1.294a.35.35 0 0 1 .19-.056H7.93c.583 0 1.054-.47 1.054-1.055V1.782c0-.584-.47-1.055-1.054-1.055M5.117 4.946h-2.86c-.463 0-.465-.703 0-.703h2.86c.464 0 .466.703 0 .703m2.11-1.406h-4.97c-.463 0-.465-.704 0-.704h4.97c.463 0 .465.704 0 .704" /><path d="M11.445 3.54H9.687V6c0 .97-.787 1.758-1.757 1.758H4.684l-.668.443v.612c0 .584.47 1.055 1.054 1.055h3.457l2.018 1.35c.276.153.549-.033.549-.296V9.868h.351c.584 0 1.055-.471 1.055-1.055V4.594c0-.583-.471-1.054-1.055-1.054" /></g><defs><clipPath id="a"><path fill="#fff" d="M.5 0h12v12H.5z" /></clipPath></defs></svg>Let’s Chat</a>

                    </frameElement>
                )
            }


            {/* Advanced Analytics Section */}

            <div className="analytics-section">
                <div className="analytics-chart">
                    <svg width="180" height="180" viewBox="0 0 180 180" className="donut-chart">
                        {/* Background circle */}
                        <circle
                            cx="90"
                            cy="90"
                            r="70"
                            fill="none"
                            stroke="#E8E5F1"
                            strokeWidth="28"
                        />
                        {/* Desktop 60% - Purple */}
                        <circle
                            cx="90"
                            cy="90"
                            r="70"
                            fill="none"
                            stroke="#5B4E96"
                            strokeWidth="28"
                            strokeDasharray="263.89 439.82"
                            strokeDashoffset="0"
                            transform="rotate(-90 90 90)"
                            strokeLinecap="round"
                        />
                        {/* Mobile 40% - Light Purple */}
                        <circle
                            cx="90"
                            cy="90"
                            r="70"
                            fill="none"
                            stroke="#C4B5E8"
                            strokeWidth="28"
                            strokeDasharray="175.93 439.82"
                            strokeDashoffset="-263.89"
                            transform="rotate(-90 90 90)"
                            strokeLinecap="round"
                        />
                        {/* Center content */}
                        <g>
                            <text x="90" y="75" textAnchor="middle" fontSize="12" fill="#9CA3AF">
                                <tspan>
                                    <svg width="16" height="16" x="82" y="60" viewBox="0 0 16 16" fill="#9CA3AF">
                                        <path d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0ZM8 14.4C6.73736 14.4 5.50485 14.0246 4.4624 13.3214C3.41995 12.6182 2.61422 11.6186 2.14864 10.4492C1.68306 9.27976 1.57901 7.99292 1.84988 6.75444C2.12075 5.51597 2.75426 4.38347 3.67452 3.50251C4.59478 2.62155 5.76348 2.03009 7.03463 1.80384C8.30578 1.57759 9.61684 1.72656 10.8024 2.23279C11.9879 2.73902 12.9975 3.58209 13.7007 4.65759C14.4039 5.73309 14.7692 7.00444 14.7692 8.27692C14.7692 9.98462 14.0692 11.6223 12.8255 12.8255C11.5818 14.0287 9.89231 14.7077 8.13846 14.7077L8 14.4Z" />
                                    </svg>
                                </tspan>
                            </text>
                            <text x="90" y="95" textAnchor="middle" fontSize="32" fontWeight="600" fill="#092161">15,754</text>
                            <text x="90" y="110" textAnchor="middle" fontSize="12" fill="#778095">Total Visitor</text>
                        </g>
                    </svg>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-dot desktop"></span>
                            <span className="legend-text">Desktop 60%</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot mobile"></span>
                            <span className="legend-text">Mobile 40%</span>
                        </div>
                    </div>
                </div>
                <div className="analytics-content">
                    <h3>Advanced Analytics</h3>
                    <p>Direct users to different steps the form, based on their</p>
                    <a href={analyticsUrl} className="view-analytics-link">
                        View Analytics
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </div>

            <frameElement>
                <p>Need help? We're here</p>
                <a href="https://embedpress.com/?support=chat" target="_blank" className="chat-button"><svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)" fill="#fff"><path d="M7.93.727H1.555C.97.727.5 1.198.5 1.782V6c0 .584.471 1.055 1.055 1.055h.351V8.11c0 .254.263.438.52.31.008-.008.022-.008.029-.015 1.934-1.297 1.5-1.008 1.933-1.294a.35.35 0 0 1 .19-.056H7.93c.583 0 1.054-.47 1.054-1.055V1.782c0-.584-.47-1.055-1.054-1.055M5.117 4.946h-2.86c-.463 0-.465-.703 0-.703h2.86c.464 0 .466.703 0 .703m2.11-1.406h-4.97c-.463 0-.465-.704 0-.704h4.97c.463 0 .465.704 0 .704" /><path d="M11.445 3.54H9.687V6c0 .97-.787 1.758-1.757 1.758H4.684l-.668.443v.612c0 .584.47 1.055 1.054 1.055h3.457l2.018 1.35c.276.153.549-.033.549-.296V9.868h.351c.584 0 1.055-.471 1.055-1.055V4.594c0-.583-.471-1.054-1.055-1.054" /></g><defs><clipPath id="a"><path fill="#fff" d="M.5 0h12v12H.5z" /></clipPath></defs></svg>Let’s Chat</a>
            </frameElement>


            {
                !isProPluginActive && (
                    <div className="upgrade-box">
                        <h5>Want to explore more?</h5>
                        <p>Dive in and discover all the premium features</p>
                        <a href="https://embedpress.com/#pricing" target="_blank" className="upgrade-link">Upgrade to PRO</a>
                    </div>
                )
            }

        </div>
    );
};

export default Upgrade;