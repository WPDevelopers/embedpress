import { useState } from 'react'
import './App.css'
import './Steps/scss/style.scss';

import GettingStarted from './Steps/GettingStarted';
import Configuration from './Steps/Configureation';
import EmbedPress from './Steps/Embedpress';
import UpgradePro from './Steps/UpgradePro';

function App() {
  const [step, setStep] = useState(1)

  return (
    <div className="onboarding-container">
      {step === 1 && <GettingStarted step={step} setStep={setStep} />}
      {step === 2 && <Configuration step={step} setStep={setStep} />}
      {step === 3 && <EmbedPress step={step} setStep={setStep} />}
      {step === 4 && <UpgradePro step={step} setStep={setStep} />}

    </div>
  )
}

export default App
