import { useEffect, useState } from 'react'
import './App.css'
import './Steps/scss/style.scss';

import GettingStarted from './Steps/GettingStarted';
import Configuration from './Steps/Configureation';
import EmbedPress from './Steps/Embedpress';
import UpgradePro from './Steps/UpgradePro';

function App() {
  const [step, setStep] = useState(1)

  const [settings, setSettings] = useState({
    embedWidth: '600',
    embedHeight: '550',
    pdfCustomColor: false,
    customColor: '#333333',
    poweredByEmbedPress: false
  });


  const saveSettings = async () => {
    const formData = new FormData();
    formData.append('ep_settings_nonce', quickSetup?.nonce || '');
    formData.append('submit', 'general');
    formData.append('enableEmbedResizeWidth', settings.embedWidth);
    formData.append('enableEmbedResizeHeight', settings.embedHeight);
    formData.append('pdf_custom_color_settings', settings.pdfCustomColor ? '1' : '0');
    formData.append('custom_color', settings.customColor);
    formData.append('action', 'embedpress_settings_action');

    console.log({ formData, settings });

    try {
      const response = await fetch(quickSetup.ajaxurl, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });

      const data = await response.json();


      if (data.success) {
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(async () => {
    await saveSettings();
  }, [step]);


  return (
    <div className="onboarding-container">
      {step === 1 && <GettingStarted step={step} setStep={setStep} />}
      {step === 2 && <Configuration step={step} setStep={setStep} settings={settings} setSettings={setSettings} />}
      {step === 3 && <EmbedPress step={step} setStep={setStep} />}
      {step === 4 && <UpgradePro step={step} setStep={setStep} />}


    </div>
  )
}

export default App
