/**
 * EmbedPress Onboarding Component
 */

import React, { useState } from 'react';

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="onboarding-step">
                        <h2>Welcome to EmbedPress!</h2>
                        <p>Let's get you started with embedding content in WordPress.</p>
                        <div className="step-content">
                            <img src="/assets/img/welcome.svg" alt="Welcome" />
                            <ul>
                                <li>Embed videos, documents, and more</li>
                                <li>Track analytics and engagement</li>
                                <li>Customize appearance and behavior</li>
                                <li>Works with Gutenberg and Elementor</li>
                            </ul>
                        </div>
                    </div>
                );
            
            case 2:
                return (
                    <div className="onboarding-step">
                        <h2>Choose Your Blocks</h2>
                        <p>Select which EmbedPress blocks you want to enable.</p>
                        <div className="step-content">
                            <div className="block-options">
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    EmbedPress Block
                                </label>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    PDF Block
                                </label>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Document Block
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    Calendar Block
                                </label>
                            </div>
                        </div>
                    </div>
                );
            
            case 3:
                return (
                    <div className="onboarding-step">
                        <h2>Configure Analytics</h2>
                        <p>Set up analytics to track your embed performance.</p>
                        <div className="step-content">
                            <div className="analytics-options">
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Enable view tracking
                                </label>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Enable click tracking
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    Enable geo tracking
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    Enable device analytics
                                </label>
                            </div>
                        </div>
                    </div>
                );
            
            case 4:
                return (
                    <div className="onboarding-step">
                        <h2>You're All Set!</h2>
                        <p>EmbedPress is ready to use. Start creating amazing embeds!</p>
                        <div className="step-content">
                            <div className="completion-actions">
                                <button className="button button-primary button-large">
                                    Create Your First Embed
                                </button>
                                <button className="button button-large">
                                    View Documentation
                                </button>
                            </div>
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="embedpress-onboarding">
            <div className="onboarding-progress">
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
                <span className="progress-text">
                    Step {currentStep} of {totalSteps}
                </span>
            </div>
            
            <div className="onboarding-content">
                {renderStep()}
            </div>
            
            <div className="onboarding-navigation">
                <button 
                    onClick={prevStep} 
                    disabled={currentStep === 1}
                    className="button"
                >
                    Previous
                </button>
                
                <button 
                    onClick={nextStep} 
                    disabled={currentStep === totalSteps}
                    className="button button-primary"
                >
                    {currentStep === totalSteps ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
