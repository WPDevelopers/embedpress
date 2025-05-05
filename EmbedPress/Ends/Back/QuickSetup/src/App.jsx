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
      pdfCustomColor: false,
      customColor: settings.pdfCustomColor || '#333333',
      poweredByEmbedPress: settings.poweredByEmbedPress || false
    },
    3: {
      test3: true
    },
    4: {
      test4: true
    }
  });

  const saveSettings = async (currentStep) => {
    const settings = stepSettings[currentStep] || {};

    if (Object.keys(settings).length === 0) {
      console.log(`No settings to save for step ${currentStep}`);
      return; // Nothing to save for this step
    }

    const formData = new FormData();
    formData.append('ep_settings_nonce', quickSetup?.nonce || '');
    formData.append('submit', 'general');
    formData.append('action', 'embedpress_quicksetup_save_settings');

    // Dynamically add only available settings
    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
        let value = settings[key];
        if (typeof value === 'boolean') {
          value = value ? '1' : '0';
        }
        formData.append(key, value);
      }
    }

    console.log(`Saving settings for step ${currentStep}`, { settings });

    try {
      const response = await fetch(quickSetup.ajaxurl, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Settings for step ${currentStep} saved successfully`);
      } else {
        console.error(`Failed to save settings for step ${currentStep}`, data);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateStepSettings = (currentStep, newSettings) => {
    setStepSettings(prev => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        ...newSettings
      }
    }));
  };

  return (
    <div className="onboarding-container">
      {step === 1 && <GettingStarted step={step} setStep={setStep} />}
      {step === 2 && (
        <Configuration
          step={step}
          setStep={setStep}
          settings={stepSettings[2]}
          setSettings={(newSettings) => updateStepSettings(2, newSettings)}
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
        />
      )}
    </div>
  );
}

export default App;
