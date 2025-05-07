import React, { useState, useRef, useEffect } from "react";

import HeaderSteps from "./HeaderSteps";
import TestimonialSlider from "./TestimonialSlider";

const GettingStarted = ({ step, setStep }) => {
    const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const videoRef = useRef(null);
    const popupRef = useRef(null);
    const popupContentRef = useRef(null);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));

    const videoBg = quickSetup.EMBEDPRESS_QUICKSETUP_ASSETS_URL + 'img/video-bg.png';
    const play = quickSetup.EMBEDPRESS_QUICKSETUP_ASSETS_URL + 'img/play.svg';

    // Video URL - you can replace this with your actual video URL
    const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

    // Function to handle video loaded event
    const handleVideoLoaded = () => {
        setIsVideoLoading(false);
    };

    // Function to open video popup with animation
    const openVideoPopup = () => {
        setIsVideoPopupOpen(true);
        setIsVideoLoading(true);
        // Add a class to body to prevent scrolling
        document.body.classList.add('epob-popup-open');
    };

    // Function to close video popup with animation
    const closeVideoPopup = () => {
        // Start closing animation
        setIsClosing(true);

        // Add closing animation classes
        if (popupContentRef.current) {
            popupContentRef.current.style.animation = 'popOut 0.3s cubic-bezier(0.19, 1, 0.22, 1) forwards';
        }

        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            setIsVideoPopupOpen(false);
            setIsClosing(false);
            // Remove the class from body to allow scrolling
            document.body.classList.remove('epob-popup-open');
            // Reset animation
            if (popupContentRef.current) {
                popupContentRef.current.style.animation = '';
            }
        }, 300);

        // Pause the video when popup is closed
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    // Close popup when clicking outside the video
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current &&
                !popupContentRef.current.contains(event.target) &&
                !isClosing) {
                closeVideoPopup();
            }
        };

        // Close popup when ESC key is pressed
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && !isClosing) {
                closeVideoPopup();
            }
        };

        if (isVideoPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isVideoPopupOpen, isClosing]);
    return (
        <>

            <HeaderSteps step={step} setStep={setStep} />

            {/* epob-intro_section  */}
            <section className="section epob-intro_section">
                <div className="epob-container">
                    <div className="epob-intro_wrapper">
                        <div className="epob-row">
                            <div className="epob-col_6">
                                <div className="epob-intro_text-wrapper">
                                    <h3 className="epob-sub_header">Get Started with EmbedPress</h3>
                                    <p className="epob-title">
                                        Enhance your storytelling by embedding interactive content from
                                        150+ platforms with exclusive customizations.
                                    </p>
                                    <a
                                        href="#"
                                        className="epob-btn epob-continue_setup-btn"
                                        onClick={nextStep}
                                    >
                                        Continue Setup
                                        <span>
                                            <svg
                                                width={6}
                                                height={13}
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
                                        </span>{" "}
                                    </a>
                                    <a href="&step=2" className="epob-btn epob-explore_website-btn">
                                        Explore Website
                                    </a>
                                </div>
                            </div>
                            <div className="epob-col_6">
                                <div className="epob-intro_video-wrapper">
                                    <div className="epob-video">
                                        <img src={videoBg} alt="" />
                                        <div className="epob-tag">
                                            <span>Introductory Video</span>
                                        </div>
                                        <a className="epob-play_btn" onClick={openVideoPopup} aria-label="Play Video">
                                            <div className="epob-play-btn-pulse"></div>
                                            <img src={play} alt="Play Video" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Video Popup */}
                        {isVideoPopupOpen && (
                            <div className="epob-video_popup" ref={popupRef} style={{ display: 'block' }}>
                                <div className="epob-video_position">
                                    <div className="epob-video_popup-content" ref={popupContentRef}>
                                        <span className="epob-close_btn" onClick={closeVideoPopup}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                                        </span>

                                        <iframe
                                            ref={videoRef}
                                            controls
                                            autoPlay
                                            onLoadedData={handleVideoLoaded}
                                            onCanPlay={handleVideoLoaded}
                                            width="560" height="315" src="https://www.youtube.com/embed/fvYKLkEnJbI?si=2mXeie2sXeC083GV&amp;controls=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <TestimonialSlider />

        </>
    )

}

export default GettingStarted;