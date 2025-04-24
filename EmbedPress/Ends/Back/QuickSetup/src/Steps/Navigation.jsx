const Navigation = ({ step, setStep, backLabel, nextLabel }) => {
    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="epob-previous_next-btn_wrapper">
            {step > 1 && (
                <a onClick={prevStep} className="epob-btn epob-previous_btn" role="button">
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
                <a onClick={nextStep} className="epob-btn epob-next_btn" role="button">
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
                <a onClick={() => alert('Onboarding complete!')} className="epob-btn epob-next_btn" role="button">
                    <span>Continue without upgrading</span>
                </a>
            )}
        </div>
    )
}

export default Navigation;
