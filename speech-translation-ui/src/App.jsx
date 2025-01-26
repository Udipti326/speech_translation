import './App.css'
import SplashScreen from './components/SplashScreen';
import CustomizedSteppers from './components/Stepper'
import { useState } from 'react';

function App() {
  const [isSplash, setIsSplash] = useState(true);

  setTimeout(() => {
    setIsSplash(false);
  }, 3000);

  return (
    <>
      {isSplash ? <SplashScreen/> : <CustomizedSteppers />}
    </>
  )
}

export default App
