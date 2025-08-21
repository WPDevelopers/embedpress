const { useState, useEffect, useRef } = wp.element;

const AdTemplate = ({ attributes, setAttributes, deleteIcon, inEditor, progressBar }) => {
    const { adSource, adContent, adFileUrl, adSkipButton } = attributes;
    const [showSkipButton, setShowSkipButton] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef(null);



    const { adWidth, adHeight } = attributes;

    const removeAd = () => {
        setAttributes({ adFileUrl: '' });
    }

    const parseDuration = (durationString) => {
        const [minutes, seconds] = durationString.split(':');
        return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    }
    let videoDuration = 0;
    if (adContent) {
        videoDuration = adContent.fileLength ? parseDuration(adContent.fileLength) : 0;
    }
    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const { currentTime } = videoElement;
            setCurrentTime(currentTime);

            if (currentTime >= 3) {
                setShowSkipButton(true);
            }
        }
    }

    useEffect(() => {
        if (adSource === 'video') {
            const videoElement = videoRef.current;
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
        } else {
            // Show skip button for image ads after 3 seconds
            const timer = setTimeout(() => {
                setShowSkipButton(true);
            }, 3000);

            return () => {
                clearTimeout(timer); // Clear the timer when the component unmounts
            };
        }
    }, [adSource, adContent, adFileUrl]);

    const handleSkipAd = () => {
        setAttributes({ adFileUrl: '' });
    }

    let size = {
        width: adWidth + 'px',
        height: adHeight + 'px',
    };

    let isMuted = false;

    if(!inEditor){
        size = {};
        isMuted = true;

    }

    return (
        <div className="main-ad-template" style={size} >
            <div className="ep-ad-container">
                <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                    {
                        deleteIcon || !inEditor && (
                            <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeAd}>
                                <span className="dashicon dashicons dashicons-trash"></span>
                            </button>
                        )
                    }
                    {adSource === 'video' ? (
                        <div>
                            <video ref={videoRef} className="ep-ad" autoPlay muted={isMuted}>
                                <source src={adFileUrl} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div>
                            <img src={adFileUrl} />
                        </div>
                    )}

                    {
                        progressBar || !(adSource === 'image') && (
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        background: '#5be82a',
                                        height: '4px',
                                        marginTop: '-4px',
                                        width: `${adSource === 'video' ? (currentTime / videoDuration) * 100 : 100
                                            }%`,
                                        maxWidth: '100%',
                                    }}
                                ></div>
                            </div>
                        )
                    }


                    {adSkipButton && showSkipButton && (
                        <button title="Skip Ad" className="skip-ad-button" onClick={handleSkipAd}>
                            Skip Ad
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdTemplate;
