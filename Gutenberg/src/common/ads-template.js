import React, { useState, useEffect, useRef } from 'react';

const AdTemplate = ({ attributes, setAttributes }) => {
    const { adSource, adContent, adFileUrl } = attributes;
    const [showSkipButton, setShowSkipButton] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef(null);

    const removeAd = () => {
        setAttributes({ adFileUrl: '' });
    }

    const parseDuration = (durationString) => {
        const [minutes, seconds] = durationString.split(':');
        return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    }

    const videoDuration = adContent.fileLength ? parseDuration(adContent.fileLength) : 10;

    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const { currentTime } = videoElement;
            setCurrentTime(currentTime);

            if (videoDuration - currentTime <= 3) {
                setShowSkipButton(true);
            }
        }
    }


    useEffect(() => {
        if (adSource === 'video' || adSource === 'image' || adSource === 'url') {
            const videoElement = videoRef.current;
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
        }
    }, [adSource, adContent]);

    const handleSkipAd = () => {
        setAttributes({ adFileUrl: '' });
    }

    return (
        <div className="main-ad-template">
            <div className="ep-ad-container">
                <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                    <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeAd}>
                        <span className="dashicon dashicons dashicons-trash"></span>
                    </button>
                    {
                        adSource === 'video' ? (
                            <div>
                                <video ref={videoRef} className="ep-ad" autoPlay>
                                    <source src={adFileUrl} />
                                    Your browser does not support the video tag.
                                </video>
                                {/* <div className="progress-bar-container">
                                <div className="progress-bar">
                                    <div style={{ width: `${(currentTime / videoDuration) * 100}%` }}></div>
                                </div>
                            </div> */}
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            background: '#5be82a',
                                            height: '4px',
                                            marginTop: '-4px',
                                            width: `${(currentTime / videoDuration) * 100}%`,
                                            maxWidth: '100%',
                                        }}
                                    ></div>
                                </div>

                                {showSkipButton && (
                                    <button title="Skip Ad" className="skip-ad-button" onClick={handleSkipAd}>
                                        Skip Ad
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <img src={adFileUrl} />
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            background: '#5be82a',
                                            height: '4px',
                                            marginTop: '-4px',
                                            width: `${(currentTime / videoDuration) * 100}%`,
                                            maxWidth: '100%',
                                        }}
                                    ></div>
                                </div>

                                {showSkipButton && (
                                    <button title="Skip Ad" className="skip-ad-button" onClick={handleSkipAd}>
                                        Skip Ad
                                    </button>
                                )}
                            </div>
                        )
                    }
                </div>
                <div className="ad-overlay">
                    <div className="ad-content">
                        <h2>Check out our product!</h2>
                        <p>Click the ad to learn more.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdTemplate;
