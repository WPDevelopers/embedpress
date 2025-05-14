import { useEffect, useState } from 'react';
import './App.css';
import './Steps/scss/style.scss';

import GettingStarted from './Steps/GettingStarted';
import Configuration from './Steps/Configuration';
import EmbedPress from './Steps/Embedpress';
import UpgradePro from './Steps/UpgradePro';

function App() {
  const [step, setStep] = useState(1);

  const settings = quickSetup.settingsData;

  // Step-wise settings
  const [stepSettings, setStepSettings] = useState({
    1: {},
    2: {
      enableEmbedResizeWidth: settings.enableEmbedResizeWidth || '600',
      enableEmbedResizeHeight: settings.enableEmbedResizeHeight || '600',
      pdf_custom_color_settings: settings.pdf_custom_color_settings || false,
      custom_color: settings.custom_color || '#333333',
      poweredByEmbedPress: settings.poweredByEmbedPress || true,
       brandingData: quickSetup?.brandingData || {}
    },
    3: {}, // EmbedPress settings
    4: {} // UpgradePro settings
  });


  const updateStepSettings = (currentStep, newSettings) => {
    setStepSettings(prev => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        ...newSettings
      }
    }));
  };

  useEffect(() => {
    console.log(stepSettings);
  }, [step]);

  return (
    <div className="onboarding-container">
      {step === 1 && <GettingStarted step={step} setStep={setStep} />}
      {step === 2 && (
        <Configuration
          step={step}
          setStep={setStep}
          settings={stepSettings[2]}
          setSettings={(newSettings) => updateStepSettings(2, newSettings)}
          stepSettings={stepSettings}
          setStepSettings={setStepSettings}
        />
      )}
      {step === 3 && (
        <EmbedPress
          step={step}
          setStep={setStep}
          settings={stepSettings[3]}
          setSettings={(newSettings) => updateStepSettings(3, newSettings)}
        />
      )}
      {step === 4 && (
        <UpgradePro
          step={step}
          setStep={setStep}
          settings={stepSettings[4]}
          setSettings={(newSettings) => updateStepSettings(4, newSettings)}
          isProActive={quickSetup.isEmbedPressProActive}
        />
      )}
    </div>
  );
}

export default App;
