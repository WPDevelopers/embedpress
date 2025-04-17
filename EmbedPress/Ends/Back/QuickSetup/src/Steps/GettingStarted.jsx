import React from "react";

import HeaderSteps from "./HeaderSteps";
import TestimonialSlider from "./TestimonialSlider";

import videoBg from '../assets/img/video-bg.png';
import play from '../assets/img/play.svg';



const GettingStarted = ({ step, setStep }) => {

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));

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
                                    <a href="#" className="epob-btn epob-explore_website-btn">
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
                                        <a className="epob-play_btn">
                                            {" "}
                                            <img src={play} alt="" />{" "}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Video Popup */}
                        <div id="epobVideoPopup" className="epob-video_popup">
                            <div className="epob-video_position">
                                <div className="epob-video_popup-content">
                                    <span className="epob-close_btn">×</span>
                                    <video controls="">
                                        <source
                                            src="https://www.w3schools.com/html/mov_bbb.mp4"
                                            type="video/mp4"
                                        />
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <TestimonialSlider />

        </>
    )

}

export default GettingStarted;