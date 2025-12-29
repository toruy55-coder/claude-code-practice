import { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import DisplayScreen from './components/DisplayScreen';

function App() {
  const [config, setConfig] = useState(null);

  const handleStart = (setupConfig) => {
    setConfig(setupConfig);
  };

  const handleBack = () => {
    setConfig(null);
  };

  return (
    <div className="min-h-screen">
      {!config ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <DisplayScreen config={config} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
